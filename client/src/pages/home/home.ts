import { globalStyles } from "../../style/globalStyles";
import { API_URL } from "../../config";
import homeStyles from "./home.scss?raw";
import axios from "axios";

const styles = new CSSStyleSheet();
styles.replaceSync(homeStyles);

interface DataCardContainer extends HTMLElement {
    data: {
        itemData: {
            id: string;
            title: string;
            location: string;
            imgUrl: string;
        }[],
        type: string
    }
}

export class HomePage extends HTMLElement {
    private _posts: any = null;
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.adoptedStyleSheets = [...globalStyles, styles];
    };

    async connectedCallback() {
        await this.getPosts();
        this.render();
    };

    private async getPosts() {
        try {
            const myPosts = await axios.get(`${API_URL}/post/posts`,{
                withCredentials: true
            });
            this._posts = myPosts.data.data
        } catch (error) {
            console.log(error);
        }
    };

    render() {
        const div = document.createElement("div");
        const CardContainer = document.createElement("card_container-component") as DataCardContainer;
        
        CardContainer.data = {
            itemData: this._posts,
            type: "report"
        }
        div.appendChild(CardContainer)

        this.shadowRoot!.appendChild(div);
    };
};

customElements.define("home-page", HomePage);