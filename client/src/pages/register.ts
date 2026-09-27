import { globalStyles } from "../style/globalStyles";
import imgLogin from "../assets/images/undraw_login_re_4vu2 1.svg";

const styles = new CSSStyleSheet();
styles.replaceSync(`
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        gap: 1.5rem;
    }

    .image-login{
        width:100%;
    }

    .register-text, .reset_password-text{
        font-size: 14px;
    }

`);

export class RegisterPage extends HTMLElement {
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
            <div class="info-page">
                <h1 class="title">Registrarse</h1>
            </div>
            <p>Ingresá los siguientes datos para realizar el registro</p>
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
                    <div class="form__input-contaier">
                        <label class="label form__label" for="ConfirmPassword">CONFIRMAR CONTRASEÑA</label>
                        <input class="input form__input" id="ConfirmPassword" type="password" autocomplete="current-password">
                    </div>
                </fieldset>
            </form>
            <p class="register-text">¿Ya tenés una cuenta? <a href="/login" class="link link-register">Inicia sesión</a></p>
            <button type="submit" form="login" class="btn">REGISTRARSE</button>
            </div>`;

    };
};

customElements.define("register-page", RegisterPage);