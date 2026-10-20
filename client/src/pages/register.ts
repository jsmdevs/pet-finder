import { globalStyles } from "../style/globalStyles";
import checkIcon from 'bootstrap-icons/icons/check-lg.svg?raw';
import xIcon from 'bootstrap-icons/icons/x-lg.svg?raw';
import axios from "axios";
import { API_URL } from "../config";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // for React, Vue and Svelte

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
        const form = this.shadowRoot!.querySelector(".form") as HTMLFormElement;
        form?.addEventListener("submit", async (e) => {
            e.preventDefault();
            this.handleProcess();
        });
    };

    private async register() {
        const emailInput = this.shadowRoot!.getElementById("Email") as HTMLInputElement;
        const passwordInput = this.shadowRoot!.getElementById("Password") as HTMLInputElement;
        const confirmPasswordInput = this.shadowRoot!.getElementById("ConfirmPassword") as HTMLInputElement;

        if (passwordInput.value === confirmPasswordInput.value) {
            try {
                await axios.post(`${API_URL}/auth/register`, {
                    email: emailInput.value,
                    password: passwordInput.value
                }, {
                    withCredentials: true
                });

                return { success: true, status: 200, message: "¡Registro exitoso!" };

            } catch (error: any) {
                if (axios.isAxiosError(error) && error.response?.status === 409) {
                    
                    return { success: false, status: 409, message: "Ese email ya está registrado" };
                } else {
                    return { success: false, status: error.response?.status, message: "Error inesperado" };
                }
            }
        } else {
            return { success: false, message: "Las contraseñas no coinciden" };
        }
    };

    private async handleProcess() {
        const btn = this.shadowRoot!.querySelector(".btn-status") as HTMLButtonElement;
        console.log("Aasas")
        const notyf = new Notyf();

        if (!btn) return;

        btn!.className = 'btn-status is-loading';
        btn.disabled = true;

        const result = await this.register();
        if (result.success) {
            btn.className = `btn-status is-success`;
            notyf.success(result.message);
            setTimeout(() => {
                window.location.href = "/login";
            }, 2500);
        } else {
            btn.className = `btn-status is-error`;
            notyf.error(result.message);
        }
        setTimeout(() => {
            btn!.className = 'btn-status';
            btn.disabled = false;

        }, 2500);
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
                        <label class="label form__label" for="firstName">NAME</label>
                        <input class ="input form__input"id="firstName" type="text" autocomplete="given-name" required>
                    </div>
                    <div class="form__input-contaier">
                        <label class="label form__label" for="address-level2">CIUDAD</label>
                        <input class ="input form__input"id="address-level2" type="text" autocomplete="address-level2" required>
                    </div>
                    <div class="form__input-contaier">
                        <label class="label form__label" for="Email">EMAIL</label>
                        <input class ="input form__input"id="Email" type="email" autocomplete="email" required>
                    </div>
                    <div class="form__input-contaier">
                        <label class="label form__label" for="Password">CONTRASEÑA</label>
                        <input class="input form__input" id="Password" type="password" autocomplete="current-password" required>
                    </div>
                    <div class="form__input-contaier">
                        <label class="label form__label" for="ConfirmPassword">CONFIRMAR CONTRASEÑA</label>
                        <input class="input form__input" id="ConfirmPassword" type="password" autocomplete="current-password" required>
                    </div>
                </fieldset>
            </form>
            <p class="register-text">¿Ya tenés una cuenta? <a href="/login" class="link link-register">Inicia sesión</a></p>
            <button type="submit" form="login" class="btn-status" type="submit">
                <span class="btn-text">REGISTRARSE</span>

                <div class="loader-wrapper">
                    <div class="loader"></div>
                </div>

                <i class="icon success-icon">${checkIcon}</i>
                <i class="icon error-icon">${xIcon}</i>
            </button>
            </div>`;

    };
};

customElements.define("register-page", RegisterPage);