<script lang="ts">
import { defineComponent, ref, h, onMounted, onUnmounted } from "vue";
import type { StylesTargetProps } from "./StylesTarget.types";

declare const __VITE_CSS_POS_GLOBAL_VAR_NAME__: string;
declare const __VITE_CSS_POS_EVENT_NAME__: string;

const globalVarName = __VITE_CSS_POS_GLOBAL_VAR_NAME__;
const eventName = __VITE_CSS_POS_EVENT_NAME__;

const getCurrent = () => (window as any)[globalVarName];

export default defineComponent({
  name: "StylesTarget",
  props: {
    onChange: {
      type: Function as unknown as () => StylesTargetProps["onChange"],
      required: false,
    },
  },
  setup(props) {
    const stylesMap = ref<Map<string, { css: string; attributes: Record<string, string> }>>(
      getCurrent() || new Map()
    );
    const version = ref(0);

    const updateListener = (_e: Event | undefined) => {
      const newValues = getCurrent() || new Map();
      stylesMap.value = newValues;
      version.value++;
      (props.onChange as StylesTargetProps["onChange"])?.(newValues);
    };

    onMounted(() => {
      window.addEventListener(eventName, updateListener);
      updateListener(undefined);
    });

    onUnmounted(() => {
      window.removeEventListener(eventName, updateListener);
    });

    return () => {
      return Array.from(stylesMap.value?.keys() || []).map((key) => {
        const entry = stylesMap.value.get(key);
        if (!entry) return null;
        return h("style", { key: `${key}-${version.value}`, ...entry.attributes }, entry.css);
      });
    };
  },
});
</script>
