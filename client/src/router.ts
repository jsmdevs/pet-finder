import Navigo from "navigo";

const router = new Navigo("/");

router
    .on("/", () => renderHome())