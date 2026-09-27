import { globalStyles } from "../../style/globalStyles";
import imgLogin from "../../assets/images/undraw_login_re_4vu2 1.svg";
import loginCss from "./login.scss?raw";

const styles = new CSSStyleSheet();
styles.replaceSync(loginCss);

export class LoginPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.adoptedStyleSheets = [...globalStyles, styles];
    };

    connectedCallback() {
        this.render();
    };

    render() {

        this.shadowRoot!.innerHTML = `
            <div class="container">
                <img class="image-login" src="${imgLogin}" alt="Imagen de inicio de sesión">
            <div class="info-page">    
                <h1 class="title">Ingresar</h1>
                <p class="subtitle">Ingresá los siguientes datos para iniciar sesión</p>
            </div>
            <form id="login"class="form form__login">
                <fieldset class="form__fielset">
                    <div class="form__input-contaier">
                        <label class="label form__label" for="Email">EMAIL</label>
                        <input class ="input form__input"id="Email" type="email" autocomplete="email">
                    </div>
                    <div class="form__input-contaier">
                        <label class="label form__label" for="Password">CONTRASEÑA</label>
                        <input class="input form__input" id="Password" type="password" autocomplete="current-password">
                    </div>
                </fieldset>
            </form>
            <a href="#" class="link link-reset_password reset_password-text">Olvidé mi contraseña</a>
            <p class="register-text">¿Aún no tenés cuenta? <a href="/register" class="link link-register">Registrate</a></p>
            <button type="submit" form="login" class="btn">INICIAR SESIÓN</button>
            </div>`;

    };
};

customElements.define("login-page", LoginPage);