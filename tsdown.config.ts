import { defineConfig } from "tsdown";

export default defineConfig({
  // ...config options
  external: ["lighningcss"],
  define: {
    "process.env.CSS_TRANSFORMER_WASM": "false",
  },
});
