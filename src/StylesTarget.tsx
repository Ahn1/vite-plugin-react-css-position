import { useEffect, useState } from "react";

const getGlobalVarName = (): string => {
  if (typeof __VITE_CSS_POS_VAR_NAME__ !== "undefined") {
    return __VITE_CSS_POS_VAR_NAME__;
  }
  return "__vite_c_css_pos_initial";
};

const getEventName = (): string => {
  if (typeof __VITE_CSS_POS_EVENT_NAME__ !== "undefined") {
    return __VITE_CSS_POS_EVENT_NAME__;
  }
  return "__vite_c_css_pos_update";
};

declare const __VITE_CSS_POS_VAR_NAME__: string | undefined;
declare const __VITE_CSS_POS_EVENT_NAME__: string | undefined;

export const StylesTarget = () => {
  const globalVarName = getGlobalVarName();
  const eventName = getEventName();
  const globalVar = (window as any)[globalVarName];

  const [stylesMap, setStylesMap] = useState<
    Map<string, { css: string; attributes: Record<string, string> }>
  >(globalVar || new Map());

  const [version, setVersion] = useState(0);

  useEffect(() => {
    const updateListener = (_e: Event | undefined) => {
      setStylesMap((window as any)[globalVarName]);
      setVersion((v) => v + 1);
    };
    window.addEventListener(eventName, updateListener);

    updateListener(undefined);

    return () => {
      window.removeEventListener(eventName, updateListener);
    };
  }, [globalVarName, eventName]);

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
