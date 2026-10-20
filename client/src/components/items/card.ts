import { globalStyles } from "../../style/globalStyles";
import cardStyles from "./card_cardContainer.scss?raw";
import alertIcon from 'bootstrap-icons/icons/exclamation-octagon-fill.svg?raw';
import { reportStore } from "../../components/reportForm/reportState";

const styles = new CSSStyleSheet();
styles.replaceSync(cardStyles);

type CardData = {
    id: string;
    title: string;
    location: string;
    imgUrl: string;
}

interface Data {
    itemData: CardData,
    type: string
}

class Card extends HTMLElement {
    private _data: CardData | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.adoptedStyleSheets = [...globalStyles, styles];
    }

    set data(Data: Data) {
        this._data = Data;
        this.render();
    }

    get data(): CardData {
        return this._data!;
    }

    connectedCallback(): void {
        this.render();
        this.cardType()
        this.setupListeners();
    }

    private cardType() {
        if (this.data.type === "report") {
            const btn = this.shadowRoot!.querySelector(".btn");
            btn?.classList.add("btn-report");
            btn.textContent = `Reportar`;
        } else if (this.data.type === "edit") {
            const btn = this.shadowRoot!.querySelector(".btn");
            btn.textContent = `Editar`;
        }
    };

    private setupListeners() {
        const btnReport = this.shadowRoot?.querySelector('.btn-report');
        btnReport?.addEventListener('click', () => {
            if (this._data.itemData) {
                // Guardamos el ID y el nombre en el store
                reportStore.openReport(Number(this.data.itemData.id), this.data.itemData.title);
                // <button class="btn btn-report" type="button">Reportar ${alertIcon}</button>
            }
        });
    }

    render() {
        if (!this._data) return;

        this.shadowRoot!.innerHTML = `
        <div class="card" id="${this.data.itemData.id}">
            <div class="card__img"><img class="img" src="${this.data.itemData.imageUrl}" alt=""></div>
            <div class="card__info info">
                <p class="info__name">${this.data.itemData.name}</p>
                <p class="info__location">${this.data.itemData.location}</p>
            </div>
            <div class="card__btn-report-container">
                <button class="btn" type="button"></button>
            </div>
        </div>
        `;
    }
}

customElements.define("card-component", Card);