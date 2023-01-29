/**
 * Compile and bundle all the distributables into dist.
 */
import * as esbuild from 'https://deno.land/x/esbuild@v0.15.10/mod.js';
import { denoPlugin } from 'https://deno.land/x/esbuild_deno_loader@0.6.0/mod.ts';
import { parse } from 'https://deno.land/std@0.170.0/flags/mod.ts';
import { copySync, ensureDir } from 'https://deno.land/std@0.170.0/fs/mod.ts';
import { resolve } from 'https://deno.land/std@0.170.0/path/mod.ts';

interface BrowserManifestSettings {
  color: string;
  omits: string[];
  // deno-lint-ignore no-explicit-any
  overrides?: { [id: string]: any };
}

interface BrowserManifests {
  [id: string]: BrowserManifestSettings;
}

const args = parse(Deno.args);
const isWatching = args.watch || args.w;

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
};

if (args._[0] === 'chrome') delete browsers.firefox;
if (args._[0] === 'firefox') delete browsers.chrome;

console.log('\x1b[37mPackager\n========\x1b[0m');

const builds = Object.keys(browsers).map(async (browserId) => {
  const distDir = `dist/${browserId}`;

  // Copy JS/HTML/CSS/ICONS
  ensureDir(`${distDir}/static`);

  const options = { overwrite: true };
  copySync('static', distDir, options);

  const browserManifestSettings = browsers[browserId];

  // Transform Manifest
  const manifest = {
    ...JSON.parse(Deno.readTextFileSync('source/manifest.json')),
    ...browserManifestSettings.overrides,
  };
  browserManifestSettings.omits.forEach((omit) => delete manifest[omit]);

  Deno.writeTextFileSync(
    distDir + '/manifest.json',
    JSON.stringify(manifest, null, 2),
  );

  const color = browserManifestSettings.color || '';
  const browserName = browserId.toUpperCase();
  const colorizedBrowserName = `\x1b[1m${color}${browserName}\x1b[0m`;
  const outdir = `dist/${browserId}/`;

  console.log(`Initializing ${colorizedBrowserName} build...`);
  const esBuildOptions: esbuild.BuildOptions = {
    entryPoints: [
      'source/options.tsx',
      'source/content_script.ts',
      'source/background.ts',
      'source/popup.tsx',
    ],
    outdir,
    bundle: true,
    format: 'esm',
    logLevel: 'verbose',
    plugins: [],
  };

  // Build Deno Plugin Options
  let importMapURL = new URL('file://' + resolve('./import_map.json'));
  if (!existsSync(importMapURL)) {
    const denoJSONFileURL = new URL('file://' + resolve('./deno.json'));
    const denoJSON = await (await fetch(denoJSONFileURL)).json();
    if (denoJSON.source || denoJSON.imports) {
      importMapURL = denoJSONFileURL;
    }
  }

  esBuildOptions.plugins = [denoPlugin(
    importMapURL ? { importMapURL } : {},
  )];

  // Add watch esbuild options
  if (isWatching) {
    esBuildOptions.watch = {
      onRebuild(error) {
        if (error) {
          console.error(`Rebuild for ${colorizedBrowserName} failed:`, error);
        } else console.log(`Rebuilt for ${colorizedBrowserName}`);
      },
    };
  }

  await esbuild.build(esBuildOptions);
  console.log(`Build complete for ${colorizedBrowserName}: ${resolve(outdir)}`);
});

await Promise.all(builds);
if (!isWatching) Deno.exit(0);

function existsSync(filePath: string | URL): boolean {
  try {
    Deno.lstatSync(filePath);
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) return false;
    throw error;
  }
}
