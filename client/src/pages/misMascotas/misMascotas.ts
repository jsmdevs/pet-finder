import { API_URL } from "../../config";
import { globalStyles } from "../../style/globalStyles";
import homeStyles from "../home/home.scss?raw";
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


export class MisMascotasPage extends HTMLElement {
    private _myPosts: any = null;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.adoptedStyleSheets = [...globalStyles, styles];
    };

   async connectedCallback () {
        await this.getMyPosts()
        this.render();
    };

    private async getMyPosts() {
        try {
            const myPosts = await axios.get(`${API_URL}/post/myposts`,{
                withCredentials: true
            });
            this._myPosts = myPosts.data.data.Posts
        } catch (error) {
            console.log(error);
        }
    };

    render() {
        const div = document.createElement("div");
        const CardContainer = document.createElement("card_container-component") as DataCardContainer;
        
        CardContainer.data = {
            itemData: this._myPosts,
            type: "edit"
        }
        div.appendChild(CardContainer)

        this.shadowRoot!.appendChild(div);
    };
};

customElements.define("mis-mascotas-page", MisMascotasPage);