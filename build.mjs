import { build } from "esbuild";
import { glob } from "glob";

await build({
  entryPoints: await glob("./src/*[!.test].ts"),
  bundle: true,
  outdir: "lib",
  outbase: "src",
  platform: "node",
  packages: "external",
  format: "esm",
  allowOverwrite: true,
});
