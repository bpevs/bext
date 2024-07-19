import * as esbuild from "esbuild";
import { denoPlugins } from "esbuild_deno_loader";
import { parseArgs } from "@std/cli";
import { copySync, ensureDir } from "@std/fs";
import { resolve } from "@std/path";

interface BrowserManifestSettings {
  color: string;
  omits: string[];
  // deno-lint-ignore no-explicit-any
  overrides?: { [id: string]: any };
}

interface BrowserManifests {
  [id: string]: BrowserManifestSettings;
}

const args = parseArgs(Deno.args);
const isWatching = args.watch || args.w;

const browsers: BrowserManifests = {
  chrome: {
    color: "\x1b[32m",
    omits: ["applications", "options_ui", "browser_action"],
  },
  firefox: {
    color: "\x1b[91m",
    overrides: {
      manifest_version: 2,
      background: {
        scripts: ["background.js"],
      },
    },
    omits: ["options_page", "host_permissions", "action"],
  },
};

if (args._[0] === "chrome") delete browsers.firefox;
if (args._[0] === "firefox") delete browsers.chrome;

console.log("\x1b[37mPackager\n========\x1b[0m");

const builds = Object.keys(browsers).map(async (browserId) => {
  const distDir = `dist/${browserId}`;

  // Copy JS/HTML/CSS/ICONS
  ensureDir(`${distDir}/static`);

  const options = { overwrite: true };
  copySync("static", distDir, options);

  const browserManifestSettings = browsers[browserId];

  // Transform Manifest
  const manifest = {
    ...JSON.parse(Deno.readTextFileSync("source/manifest.json")),
    ...browserManifestSettings.overrides,
  };
  browserManifestSettings.omits.forEach((omit) => delete manifest[omit]);

  Deno.writeTextFileSync(
    distDir + "/manifest.json",
    JSON.stringify(manifest, null, 2),
  );

  const color = browserManifestSettings.color || "";
  const browserName = browserId.toUpperCase();
  const colorizedBrowserName = `\x1b[1m${color}${browserName}\x1b[0m`;
  const outdir = `dist/${browserId}/`;

  console.log(`Initializing ${colorizedBrowserName} build...`);
  const esBuildOptions: esbuild.BuildOptions = {
    entryPoints: [
      "source/options.tsx",
      "source/content_script.ts",
      "source/background.ts",
      "source/popup.tsx",
    ],
    outdir,
    bundle: true,
    format: "esm",
    logLevel: "verbose",
    plugins: [],
  };

  // Build Deno Plugin Options
  let importMapURL: string | undefined = resolve('./import_map.json');

  if (!existsSync(importMapURL)) {
    importMapURL = undefined;
  }
  const configUrl = resolve('./deno.json');

  esBuildOptions.plugins = [
    ...denoPlugins(
      importMapURL
        ? {
          importMapURL: importMapURL,
          configPath: configUrl,
        }
        : {
          configPath: configUrl,
        },
    ),
  ];

  // Add watch esbuild options
  if (isWatching) {
    const watchplugin: esbuild.Plugin = {
      name: "watch-plugin",
      setup(build) {
        build.onEnd((result) => {
          if (result.errors.length != 0) {
            console.error(
              `Rebuild for ${colorizedBrowserName} failed:`,
              result.errors,
            );
          } else console.log(`Rebuilt for ${colorizedBrowserName}`);
        });
      },
    };
    esBuildOptions.plugins = [...esBuildOptions.plugins, watchplugin];
    const ctx = await esbuild.context({ ...esBuildOptions });
    await ctx.watch();
  } else {
    await esbuild.build({ ...esBuildOptions });
  }

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
