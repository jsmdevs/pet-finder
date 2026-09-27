import { resetStyle } from './resetStyleComponents';
import globalCss from "./globalStyles.scss?raw"

const globalTheme = new CSSStyleSheet();
globalTheme.replaceSync(globalCss);

// Puedes exportar un array con todas las hojas globales juntas
export const globalStyles = [resetStyle, globalTheme];