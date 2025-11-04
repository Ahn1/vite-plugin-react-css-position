import { useEffect, useState } from "react";

const getCurrent = () => (window as any)["__vite_c_css_pos_initial"];

const StylesTarget = (props: {
  onChange?: (
    stylesMap: Map<string, { css: string; attributes: Record<string, string> }>
  ) => void;
}) => {
  const globalVarName = "__vite_c_css_pos_initial";
  const eventName = "__vite_c_css_pos_update";

  const [stylesMap, setStylesMap] = useState<
    Map<string, { css: string; attributes: Record<string, string> }>
  >(getCurrent() || new Map());

  const [version, setVersion] = useState(0);

  useEffect(() => {
    const updateListener = (_e: Event | undefined) => {
      const newValues = getCurrent() || new Map();
      setStylesMap(newValues);
      setVersion((v) => v + 1);
      props.onChange?.(newValues);
    };
    window.addEventListener(eventName, updateListener);

    updateListener(undefined);

    return () => {
      window.removeEventListener(eventName, updateListener);
    };
  }, [globalVarName, eventName, props.onChange]);

  return Array.from(stylesMap?.keys() || []).map((key) => {
    const entry = stylesMap.get(key);
    if (!entry) return null;
    return (
      <style {...entry.attributes} key={`${key}-${version}`}>
        {entry.css}
      </style>
    );
  });
};

export default StylesTarget;
