import type { Plugin } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default function viteCustomCssPosition(): Plugin | Plugin[] {
  const cssPlugin = cssInjectedByJsPlugin({
    dev: {
      enableDev: true,
      removeStyleCode(id: string) {
        return `
      (() => {
            if(window.__vite_c_css_pos_initial && window.__vite_c_css_pos_initial.has('${id}')) {
              window.__vite_c_css_pos_initial.delete('${id}');
              window.dispatchEvent( new Event('__vite_c_css_pos_update') );
            }
      })()
            `;
      },
    },
    injectCode: (css, attributes) => {
      const attributesString = JSON.stringify(attributes.attributes);
      const id = `"${
        attributes.attributes?.["data-vite-dev-id"] ?? "__nokey__"
      }"`;
      return `
      const css = ${css};
      const id = ${id};
        const attributes = JSON.parse('${attributesString}');
        window.__vite_c_css_pos_initial = window.__vite_c_css_pos_initial || new Map();
        window.__vite_c_css_pos_initial.set(id, {css, attributes});

        window.dispatchEvent( new Event('__vite_c_css_pos_update') );
      `;
    },
  });

  return [
    {
      name: "vite-plugin-custom-css-position",
    } satisfies Plugin,
    ...(Array.isArray(cssPlugin) ? cssPlugin : [cssPlugin]),
  ];
}
