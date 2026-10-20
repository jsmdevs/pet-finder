import { globalStyles } from "../../style/globalStyles";
import cardStyles from "./card_cardContainer.scss?raw";

const styles = new CSSStyleSheet();
styles.replaceSync(cardStyles);

type ItemData = {
    id: string;
    title: string;
    location: string;
    imgUrl: string;
}

type CardData = {
    itemData: ItemData[];
    type: string;
}

interface CardElement extends HTMLElement {
    data: {
        itemData: ItemData;
        type: string;
    };
}

class CardContainer extends HTMLElement {

    private _data: CardData | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.adoptedStyleSheets = [...globalStyles, styles];

    };

    connectedCallback() {
        this.render()
    };

    set data(data: CardData) {
        this._data = data;
    }

    get data(): CardData {
        return this._data!;
    }

    render() {
        this.shadowRoot!.innerHTML = `
            <div class="cards-container"></div>
        `;

        const cardContainer = this.shadowRoot!.querySelector(".cards-container");

        const formReport = document.createElement("reportform-component");
        cardContainer!.appendChild(formReport);
        this.data.itemData.forEach(itemData => {
            // 1. Creamos la etiqueta del componente hijo
            const itemElement = document.createElement('card-component') as CardElement;

            // 2. Le pasamos el objeto de esta posición
            itemElement.data = { 
                itemData,
                type:this.data.type
             };

            // 3. Lo insertamos en el contenedor
            cardContainer!.appendChild(itemElement);
        });
    };
};
1
customElements.define("card_container-component", CardContainer);