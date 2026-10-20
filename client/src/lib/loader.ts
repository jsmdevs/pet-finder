let pending = 0;
let timer: number | undefined;
let el: HTMLDivElement | null = null;

const STYLES = `
#app-loader {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    z-index: 9999;
}
#app-loader[hidden] { display: none; }
#app-loader .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #ddd;
    border-top-color: #333;
    border-radius: 50%;
    animation: app-loader-spin 0.8s linear infinite;
}
@keyframes app-loader-spin { to { transform: rotate(360deg); } }
`;

function getEl(): HTMLDivElement {
    if (el && el.isConnected) return el;

    if (!document.getElementById("app-loader-styles")) {
        const style = document.createElement("style");
        style.id = "app-loader-styles";
        style.textContent = STYLES;
        document.head.appendChild(style);
    }

    el = document.createElement("div");
    el.id = "app-loader";
    el.hidden = true;
    el.innerHTML = `<div class="spinner"></div>`;
    document.body.appendChild(el);
    return el;
}

export const Loader = {
    show(delay = 150) {
        pending++;
        if (pending === 1) {
            timer = window.setTimeout(() => (getEl().hidden = false), delay);
        }
    },
    hide() {
        pending = Math.max(0, pending - 1);
        if (pending === 0) {
            clearTimeout(timer);
            getEl().hidden = true;
        }
    },
};

export async function withLoader<T>(task: () => Promise<T>): Promise<T> {
    Loader.show();
    try {
        return await task();
    } finally {
        Loader.hide();
    }
}