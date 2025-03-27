/**
 * @module
 * Compiles and bundles all the distributables into dist, using esbuild.
 * In addition, using the `manifest.json`, format browser-specific compatible
 * `manifest.json` files.
 *
 * @example
 * ```sh
 * deno install -g --name=bext-internal -Ag jsr:@bpev/bext/bin
 * cd ./my_project
 * bext # both
 * bext chrome # only chrome
 * bext firefox # only ff
 * bext --watch # build again on change
 * bext chrome -w # variations can be used for single-platform
 * bext firefox --watch
 * bext --source=src --static=public --output=builds # custom paths
 * ```
 */

// Keep imports for this file local, to ensure it can be run independently
import * as esbuild from 'esbuild'
import { denoPlugins } from '@luca/esbuild-deno-loader'
import { parseArgs } from '@std/cli'
import { copy, ensureDir, exists } from '@std/fs'
import { join, resolve } from '@std/path'

interface BrowserManifestSettings {
  color: string
  omits: string[]
  // deno-lint-ignore no-explicit-any
  overrides?: { [id: string]: any }
}

interface BrowserManifests {
  [id: string]: BrowserManifestSettings
}

const args = parseArgs(Deno.args, {
  string: ['source', 'static', 'output'],
  boolean: ['watch'],
  alias: {
    w: 'watch',
    s: 'source',
    t: 'static',
    o: 'output',
  },
  default: {
    source: 'source',
    static: 'static',
    output: 'dist',
  },
})

const isWatching = args.watch

const browsers: BrowserManifests = {
  chrome: {
    color: '\x1b[32m',
    omits: ['applications', 'options_ui', 'browser_action'],
  },
  firefox: {
    color: '\x1b[91m',
    overrides: {
      manifest_version: 2,
      background: {
        scripts: ['background.js'],
      },
    },
    omits: ['options_page', 'host_permissions', 'action'],
  },
}

if (args._[0] === 'chrome') delete browsers.firefox
if (args._[0] === 'firefox') delete browsers.chrome

const entryNames = [
  'options',
  'content_script',
  'contentScript',
  'background',
  'popup',
]
const entryPoints: string[] = []

await Promise.all(entryNames.map(async (name) => {
  const jsPath = `${args.source}/${name}.js`
  const jsxPath = `${args.source}/${name}.jsx`
  const tsPath = `${args.source}/${name}.ts`
  const tsxPath = `${args.source}/${name}.tsx`
  if (await exists(jsPath)) entryPoints.push(jsPath)
  else if (await exists(jsxPath)) entryPoints.push(jsxPath)
  else if (await exists(tsPath)) entryPoints.push(tsPath)
  else if (await exists(tsxPath)) entryPoints.push(tsxPath)
}))

console.log('\x1b[37mPackager\n========\x1b[0m')
console.log(`Using paths:
source: "${resolve(args.source)}"
static: "${resolve(args.static)}"
output: "${resolve(args.output)}"
`)

await ensureDir(resolve(args.output))

const builds = Object.keys(browsers).map(async (browserId) => {
  /** Browser-Specific Build Path */
  const outdir = join(args.output, browserId)
  await ensureDir(resolve(outdir))

  // Copy JS/HTML/CSS/ICONS
  if (await exists(args.static)) {
    await ensureDir(join(outdir, 'static'))

    const options = { overwrite: true }
    await copy(args.static, outdir, options)
  }

  const browserManifestSettings = browsers[browserId]

  // Transform Manifest
  const manifest = {
    ...JSON.parse(Deno.readTextFileSync(`${args.source}/manifest.json`)),
    ...browserManifestSettings.overrides,
  }
  browserManifestSettings.omits.forEach((omit) => delete manifest[omit])

  Deno.writeTextFileSync(
    outdir + '/manifest.json',
    JSON.stringify(manifest, null, 2),
  )

  const color = browserManifestSettings.color || ''
  const browserName = browserId.toUpperCase()
  const colorizedBrowserName = `\x1b[1m${color}${browserName}\x1b[0m`

  console.log(`Initializing ${colorizedBrowserName} build...`)
  const esBuildOptions: esbuild.BuildOptions = {
    entryPoints,
    outdir,
    bundle: true,
    format: 'esm',
    logLevel: 'verbose',
    plugins: [],
  }

  esBuildOptions.plugins = [
    ...denoPlugins({ configPath: resolve('./deno.json') }),
  ]

  // Add watch esbuild options
  if (isWatching) {
    const watchplugin: esbuild.Plugin = {
      name: 'watch-plugin',
      setup(build) {
        build.onEnd((result) => {
          if (result.errors.length != 0) {
            console.error(
              `Rebuild for ${colorizedBrowserName} failed:`,
              result.errors,
            )
          } else console.log(`Rebuilt for ${colorizedBrowserName}`)
        })
      },
    }
    esBuildOptions.plugins = [...esBuildOptions.plugins, watchplugin]
    const ctx = await esbuild.context({ ...esBuildOptions })
    await ctx.watch()
  } else {
    await esbuild.build({ ...esBuildOptions })
  }

  console.log(`Build complete for ${colorizedBrowserName}: ${resolve(outdir)}`)
})

await Promise.all(builds)
if (!isWatching) Deno.exit(0)
