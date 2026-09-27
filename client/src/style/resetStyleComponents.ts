import resetCss from "./reset.css?raw"

export const resetStyle = new CSSStyleSheet();
resetStyle.replaceSync(resetCss);