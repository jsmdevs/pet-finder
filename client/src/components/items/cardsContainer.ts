import { globalStyles } from "../../style/globalStyles";
import cardStyles from "./card_cardContainer.scss?raw";

const styles = new CSSStyleSheet();
styles.replaceSync(cardStyles);

interface CardData {
    title: string;
    location: string;
    imgUrl: string
}

interface CardElement extends HTMLElement {
    data: CardData;
}

class CardContainer extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.adoptedStyleSheets = [...globalStyles, styles];

    };

    array = [
        {
            id: "10",
            title: "Boby",
            location: "Nuñez, Buenos Aires",
            imgUrl:"https://i0.wp.com/puppis.blog/wp-content/uploads/2022/03/etapas-desarrollo-gatitos-min.jpg?resize=1024%2C769&ssl=1"
        },
        {
            id: "10",
            title: "Toby",
            location: "Mar Del Plata, Buenos Aires",
            imgUrl:"https://i0.wp.com/puppis.blog/wp-content/uploads/2020/02/Particularidades-de-los-felinos.jpg?resize=1024%2C683&ssl=1"
        },
        {
            id: "10",
            title: "Tor",
            location: "Dolores, Buenos Aires",
            imgUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTptAbB0ThRGLczS8qgVrJXfq3k06tRxnfa96MkOQgnYuEr9YoZQ0QPABa9&s=10"
        },
        {
            id: "10",
            title: "Missi",
            location: "Lanús, Buenos Aires",
            imgUrl:"https://i0.wp.com/puppis.blog/wp-content/uploads/2022/03/etapas-desarrollo-perros-cachorros-gatitos-min.jpg?resize=1024%2C683&ssl=1"
        },
        {
            id: "10",
            title: "Missi",
            location: "Lanús, Buenos Aires",
            imgUrl:"https://i0.wp.com/puppis.blog/wp-content/uploads/2022/03/etapas-desarrollo-perros-cachorros-gatitos-min.jpg?resize=1024%2C683&ssl=1"
        },
        {
            id: "10",
            title: "Border",
            location: "Nuñez, Buenos Aires",
            imgUrl:"https://www.cadenadial.com/wp-content/uploads/2023/02/1666-9-1422x800.jpg"
        },
    ];

    connectedCallback() {
        this.render()

    };

    render() {
        this.shadowRoot!.innerHTML = `
            <div class="cards-container"></div>
        `;
        
        const cardContainer = this.shadowRoot!.querySelector(".cards-container");

        const formReport = document.createElement("reportform-component");
        cardContainer!.appendChild(formReport);


        this.array.forEach(itemData => {
            // 1. Creamos la etiqueta del componente hijo
            const itemElement = document.createElement('card-component') as CardElement;

            // 2. Le pasamos el objeto de esta posición
            itemElement.data = itemData;

            // 3. Lo insertamos en el contenedor
            cardContainer!.appendChild(itemElement);
        });
    };
};
1
customElements.define("card_container-component", CardContainer);