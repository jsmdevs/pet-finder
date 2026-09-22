export class HomePage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    };

    render(){
        
    };
};

customElements.define("home-page", HomePage);