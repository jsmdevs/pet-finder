import { globalStyles } from "../../style/globalStyles";
import cardStyles from "./card_cardContainer.scss?raw";
import alertIcon from 'bootstrap-icons/icons/exclamation-octagon-fill.svg?raw';
import { reportStore } from "../../components/reportForm/reportState";

const styles = new CSSStyleSheet();
styles.replaceSync(cardStyles);

interface CardData {
    id: string;
    title: string;
    location: string;
    imgUrl: string;
}

class Card extends HTMLElement {
    private _data: CardData | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.adoptedStyleSheets = [...globalStyles, styles];
    }

    set data(item: CardData) {
        this._data = item;
        this.render();
    }

    get data(): CardData {
        return this._data!;
    }

    connectedCallback(): void {
        this.render();
    }

    private setupListeners() {
        const btnReport = this.shadowRoot?.querySelector('.btn-report');
        btnReport?.addEventListener('click', () => {
            if (this._data) {
                // Guardamos el ID y el nombre en el store
                reportStore.openReport(Number(this.data.id), this.data.title);
            }
        });
    }

    render() {
        if (!this._data) return;

        this.shadowRoot!.innerHTML = `
        <div class="card" id="${this.data.id}">
            <div class="card__img"><img class="img" src="${this.data.imgUrl}" alt="${this.data.title}"></div>
            <div class="card__info info">
                <p class="info__name">${this.data.title}</p>
                <p class="info__location">${this.data.location}</p>
            </div>
            <div class="card__btn-report-container">
                <button class="btn btn-report" type="button">Reportar ${alertIcon}</button>
            </div>
        </div>
        `;

        this.setupListeners();
    }
}

customElements.define("card-component", Card);