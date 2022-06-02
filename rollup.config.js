import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-only";
import sveltePreprocess from "svelte-preprocess";
import childProcess from "child_process";
import eslint from "@rollup/plugin-eslint";

const production = !process.env.ROLLUP_WATCH;

const OUTPUT_FOLDER = "public/build";

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = childProcess.spawn("npm", ["run", "start", "--", "--dev"], {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true
      });

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    }
  };
}

export default [
  {
    input: "src/main.js",
    output: {
      sourcemap: true,
      format: "iife",
      name: "CERCrawler",
      file: `${OUTPUT_FOLDER}/bundle.js`
    },
    plugins: [

      eslint({fix: true}),

      svelte({
        compilerOptions: {
          // enable run-time checks when not in production
          dev: !production
        },
        preprocess: sveltePreprocess()
      }),

      // we'll extract any component CSS out into
      // a separate file - better for performance
      css({ output: "bundle.css" }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
        browser: true,
        dedupe: ["svelte"]
      }),
      commonjs(),

      // In dev mode, call `npm run start` once
      // the bundle has been generated
      !production && serve(),

      // Watch the `public` directory and refresh the
      // browser on changes when not in production
      !production && livereload("public"),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production &&
        terser({
          compress: {
            drop_console: true,
            ie8: false,
            toplevel: false
          }
        })
    ],
    watch: {
      clearScreen: false
    }
  },
  {
    input: "src/background/background.js",
    output: {
      sourcemap: true,
      format: "iife",
      file: `${OUTPUT_FOLDER}/background.js`
    },
    plugins: [
      resolve({
        browser: true,
        dedupe: ["svelte"]
      }),
      commonjs(),
      production && terser()
    ],
    watch: {
      clearScreen: false
    }
  },
  {
    input: "src/content/injection.js",
    output: {
      sourcemap: true,
      format: "iife",
      file: `${OUTPUT_FOLDER}/injection.js`
    },
    plugins: [
      resolve({
        browser: true,
        dedupe: ["svelte"]
      }),
      commonjs(),
      production && terser()
    ],
    watch: {
      clearScreen: false
    }
  }
];
