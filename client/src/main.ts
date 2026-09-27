import("./routes/router");
import("./style/reset.css");
import("./style/globalStyles.scss");

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `

<header-component></header-component>
<omni-router></omni-router>
`;
