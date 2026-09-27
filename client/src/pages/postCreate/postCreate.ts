import { globalStyles } from "../../style/globalStyles";
import homeStyles from "./postCreate.scss?raw";
import imageNull from "./../../assets/images/image-null.png"
import mapboxCss from "mapbox-gl/dist/mapbox-gl.css?raw"
import * as mapboxgl from 'mapbox-gl/esm';

const styles = new CSSStyleSheet();
styles.replaceSync(homeStyles);
const mapboxStyles = new CSSStyleSheet();
mapboxStyles.replaceSync(mapboxCss);

export class PostCreate extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.adoptedStyleSheets = [...globalStyles, styles, mapboxStyles];
    };

    connectedCallback() {
    // Pisa el position:absolute y el height:100% que omni-router
    // le aplica vía su clase interna ".page"
    this.style.position = "static";
    this.style.height = "auto";
    this.style.width = "100%";

    this.render();
};

    async searchByLocation(lat: number, lng: number) {
        const API_KEY = `VVbFGJEMFqNM8SmqraryVTyddJZj6507`;
        const url = `https://api.tomtom.com/search/2/reverseGeocode/` +
            `${lat},${lng}` +
            `.json?` +
            `key=${API_KEY}` +
            `&countrySet=AR` +
            `&limit=1` +
            `&typeahead=true`

        const response = await fetch(url);
        const data = await response.json()

        const locationEl = this.shadowRoot!.getElementById('input-location') as HTMLInputElement;

        if (data.addresses[0].address.streetNameAndNumber) {
            locationEl!.value = data.addresses[0].address.streetNameAndNumber
        } else {
            locationEl!.value = "";
        }


        // return(await result.json());
    };

    async searchByQuery(query: string) {
        const API_KEY = `VVbFGJEMFqNM8SmqraryVTyddJZj6507`;
        const encodedQuery = encodeURIComponent(query);
        const url = `https://api.tomtom.com/search/2/search/` +
            encodedQuery +
            `.json?` +
            `key=${API_KEY}` +
            `&countrySet=AR` +
            `&limit=3` +
            `&typeahead=true`

        const response = await fetch(url);
        const data = await response.json()

        return data;
    };

    render() {
        this.shadowRoot!.innerHTML = `
        <div class="container">
            <div class="info-page">
                <h1 class="title">Reportar mascota</h1>
                <p class="subtitle">Ingresá la siguiente información para realizar el reporte de la mascota</p>
            </div>
            <div class="form form-publish" id="form-publish">
                <fieldset class="form__fielset">
                    <div class="form__input-contaier">
                        <label class="label form__label" for="">NOMBRE</label>
                        <input class="input form__input" type="name" name="firstname" autocomplete="given-name" id="">
                    </div>
                    <div class="preview-img">
                        <img src=${imageNull} alt="">
                    </div>
                    <button class="btn">Agregar foto</button>
                    <div class="map">
                        <p class="map__text">Buscá un punto de referencia para reportar la mascota. Por ejemplo, la ubicación donde lo viste por última vez.</p>
                        <div id="map" class="mapbox-view"></div>
                    </div>
                    <div class="form__input-contaier">
                        <label class="label form__label" for="">UBICACÍON</label>
                        <input id="input-location" class="input form__input" type="text">
                    </div>
                </fieldset>
            </div>
            <button class="btn btn_form-publish" type="submit" form="form-publish">Reportar mascota</button>
        </div>`;

        const mapContainer = this.shadowRoot!.querySelector<HTMLElement>("#map");
        const inputLocation = this.shadowRoot!.getElementById("input-location") as HTMLInputElement;
        if (!mapContainer) {
            throw new Error("No se encontró el contenedor del mapa");
        }


        const map = new mapboxgl.Map({
            accessToken: "pk.eyJ1IjoianNtZGV2cyIsImEiOiJjbXRuZWtweGYwMmFmMzBweDdlejl3cWNwIn0.WazgIaKGYFWexWJ3NDMdvw",
            container: mapContainer,
            center: [-57.67636596265029, -36.31538504491035],
            zoom: 12
        });

        let marker: any = null;

        map.on('click', async (event) => {
            const coords = event.lngLat;
            const lng = coords.lng;
            const lat = coords.lat;

            if (marker) {
                marker.setLngLat([lng, lat]);
            } else {
                marker = new mapboxgl
                .Marker()
                .setLngLat([lng, lat])
                .addTo(map);
            };

            this.searchByLocation(lat, lng);
        });

        let debounceTimer: any;

        inputLocation.addEventListener("input", (e: any) => {
            const query = e.target!.value;

            clearTimeout(debounceTimer);

            if (query) {
                debounceTimer = setTimeout(async () => {
                    const res = await this.searchByQuery(query);
                    console.log(res)
                }, 500);
            };
        });
    };
};

customElements.define("postcreate-page", PostCreate);