import { globalStyles } from "../../style/globalStyles";
import homeStyles from "./reportForm.scss?raw";
import { reportStore } from "./reportState";
import closeIcon from 'bootstrap-icons/icons/x.svg?raw'

const styles = new CSSStyleSheet();
styles.replaceSync(homeStyles);

export class ReportFormComponent extends HTMLElement {
    private petName: string = "";
    private petId: number | null = null;
    private handleStateChange: EventListener;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.adoptedStyleSheets = [...globalStyles, styles];

        // Guardamos la referencia para poder desuscribir el listener correctamente
        this.handleStateChange = ((e: CustomEvent) => {
            const { petId, petName } = e.detail;
            this.petId = petId;
            this.petName = petName;
            const reportFormEl = this.shadowRoot!.querySelector(".reportForm-wraped");
            const petNameEl = this.shadowRoot!.querySelector(".petname");
            petNameEl!.innerHTML = `${this.petName}`;

            reportFormEl?.classList.add("active");
        }) as EventListener;
    }

    as() {

    }

    connectedCallback() {
        // Escuchamos los cambios en el state
        this.render();
        reportStore.addEventListener('report-state-changed', this.handleStateChange);
        const closeBtn = this.shadowRoot!.querySelector(".btn-close");
        closeBtn?.addEventListener("click", () => {
            const asd = this.shadowRoot!.querySelector(".reportForm-wraped");
            asd?.classList.remove("active")
        })
    }

    disconnectedCallback() {
        // Limpiamos el listener si el componente se desmonta
        reportStore.removeEventListener('report-state-changed', this.handleStateChange);
    }

    private setupFormListeners() {
        const form = this.shadowRoot?.querySelector('#reportForm') as HTMLFormElement | null;

        form?.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                petId: this.petId,
                reporterName: (this.shadowRoot?.querySelector('#name') as HTMLInputElement)?.value,
                reporterPhone: (this.shadowRoot?.querySelector('#phone') as HTMLInputElement)?.value,
                locationSeen: (this.shadowRoot?.querySelector('#text') as HTMLInputElement)?.value,
            };

            console.log('Enviando reporte:', formData);

            // Acá llamás a tu servicio/API para enviar los datos...

            // Una vez enviado, limpiamos el formulario/estado si querés:
            reportStore.closeReport();
        });
    }

    render() {
        // Si no hay reporte activo, se puede ocultar o mostrar vacío

        this.shadowRoot!.innerHTML = `
       <div class="reportForm-wraped">
         <div class="reportForm desibled">
            <button class="btn-close">${closeIcon}</button>
            <div class="info-page">
                <h2 class="title">Reportar info de <span class="petname"></span></h2>
            </div>
            <form class="form" id="reportForm">
                <fieldset>
                    <div class="form__input-contaier">
                        <label class="label" for="name">NOMBRE</label>
                        <input class ="input" name="firstname" type="text" id="name" autocomplete="given-name" required>
                    </div>
                    <div class="form__input-contaier">
                        <label  class="label" for="phone">TELÉFONO</label>
                        <input class ="input" type="tel" id="phone" autocomplete="tel" required>
                    </div>
                    <div class="form__input-contaier">
                        <label class="label" for="text">¿DÓNDE LO VISTE?</label>
                        <textarea class="input textarea" id="text" required></textarea>
                    </div>
                </fieldset>
                <button type="submit" class="btn">ENVIAR REPORTE</button>
            </form>
        </div>
       </div>
        `;

        this.setupFormListeners();
    }
}

customElements.define("reportform-component", ReportFormComponent);