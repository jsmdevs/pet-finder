import { globalStyles } from "../../style/globalStyles";
import imgLogo from "./../../../public/logo.png";
import hamburgerCss from "./../../style/hamburgers.css?raw";
import headerCss from "./../header/header.scss?raw";
import personIcon from 'bootstrap-icons/icons/person-circle.svg?raw';

const styles = new CSSStyleSheet();
styles.replaceSync(headerCss);
const hamburgerStyles = new CSSStyleSheet();
hamburgerStyles.replaceSync(hamburgerCss);

class Header extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.adoptedStyleSheets = [...globalStyles, hamburgerStyles, styles];
    };

    connectedCallback() {
        this.render();

        const nav = this.shadowRoot!.querySelector(".nav");
        const btnHambuger = this.shadowRoot!.querySelector(".hamburger");

        btnHambuger?.addEventListener("click", () => {
            btnHambuger.classList.toggle("is-active");
            nav?.classList.toggle("active")
        });
    };

    render() {
        this.shadowRoot!.innerHTML = `
       <header class="header">
        <div class="img-logo">
            <img src=${imgLogo} alt="Logo del header">
        </div>
        <nav class="nav">
            <ul>
                <li><a class="link-nav" href="/">Inicio</a></li>
                <li><a class="link-nav" href="#">Mis mascotas</a></li>
                <li><a class="link-nav" href="/nueva-publicacion">Publicar mascota</a></li>
            </ul>
        </nav>
        <a class="my-account-btn icon" href="/login">${personIcon}</a>
        <button class="hamburger hamburger--collapse" type="button">
            <span class="hamburger-box">
                <span class="hamburger-inner"></span>
            </span>
        </button>
        </header>
        `;
    };
};

customElements.define("header-component", Header);