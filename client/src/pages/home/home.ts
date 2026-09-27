import { globalStyles } from "../../style/globalStyles";
import homeStyles from "./home.scss?raw";

const styles = new CSSStyleSheet();
styles.replaceSync(homeStyles);

export class HomePage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.adoptedStyleSheets = [...globalStyles, styles];
    };

    connectedCallback() {
        this.render();

        const btnReport = this.shadowRoot!.querySelector(".btn-report");

        if(btnReport){
            btnReport.addEventListener("click", () => {
                console.log('a')
            });
        }else{
            console.log("no existe")
        }

    };

    render() {
        const div = document.createElement("div");
        div.innerHTML = `
            <card_container-component></card_container-component>
        `;
        
        this.shadowRoot!.appendChild(div);
    };
};

customElements.define("home-page", HomePage);