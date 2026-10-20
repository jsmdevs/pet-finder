import { globalStyles } from "../../style/globalStyles";
import myAccountStyles from "./myAccount.scss?raw";
import axios from "axios"
import { API_URL } from "../../config";

const styles = new CSSStyleSheet();
styles.replaceSync(myAccountStyles);

export class MyAccountPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.adoptedStyleSheets = [...globalStyles, styles];
    };

    connectedCallback() {
        this.render();
        this.changeContent();
        
    };

    private async showReports() {
        const data = await axios.get(`${API_URL}/report/`, {
            withCredentials: true
        });

        return(data);
    };
    private async showMyData() {
        const data = await axios.get(`${API_URL}/user/me`, {
            withCredentials: true
        });

        return(data);
    };
    private async showMyPosts() {
        const data = await axios.get(`${API_URL}/post/myposts`, {
            withCredentials: true
        });

        return(data);
    };

    private changeContent() {
        const items = this.shadowRoot!.querySelectorAll(".menu__item");
        items.forEach((item) => {
            item!.addEventListener("click", async (e) => {
                if (e.target instanceof HTMLElement) {
                    if(e.target.id === "reports"){
                        const res = await this.showReports();
                        console.log(res)
                    } else if(e.target.id === "mydata"){
                        const res = await this.showMyData();
                        console.log(res);
                    } else if(e.target.id === "myposts"){
                        const res = await this.showMyPosts();
                        console.log(res);

                    };
                };
            });
        });
    };

    render() {
        const div = document.createElement("div");
        div.innerHTML = `
             <div class="container">
                <div class="info-page">
                    <h1 class="title">Mi cuenta</h1>
                </div>
                <ul class="menu">
                    <li class="menu__item"><button class="btn" id="mydata">Mis datos</button></li>
                    <li class="menu__item"><button class="btn" id="reports">Reportes</button></li>
                    <li class="menu__item"><button class="btn" id="myposts">Posteos</button></li>
                </ul>
                <div class="menu-selected"></div>
            </div>
        `;

        this.shadowRoot!.appendChild(div);
    };
};

customElements.define("my-account-page", MyAccountPage);