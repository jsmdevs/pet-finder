import { globalStyles } from "../../style/globalStyles";
import homeStyles from "./postCreate.scss?raw";
import mapboxCss from "mapbox-gl/dist/mapbox-gl.css?raw"
import * as mapboxgl from 'mapbox-gl/esm';
import Dropzone from "dropzone";
import axios from "axios";
import checkIcon from 'bootstrap-icons/icons/check-lg.svg?raw';
import xIcon from 'bootstrap-icons/icons/x-lg.svg?raw';
import { API_URL } from "../../config";
import { validatePostData } from "../../utils/validatePost";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // for React, Vue and Svelte
import circle from "@turf/circle";
import { searchLocationByQuery, reverseGeocode } from "../../lib/tomtomSearch";
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

type Location = {
    lat: number,
    lng: number
}

interface DataPublish {
    name: string,
    location: Location | null,
    nameLocation: string,
    image: string
}

const styles = new CSSStyleSheet();
styles.replaceSync(homeStyles);
const mapboxStyles = new CSSStyleSheet();
mapboxStyles.replaceSync(mapboxCss);

export class PostCreate extends HTMLElement {

    private map?: mapboxgl.Map;
    private marker?: mapboxgl.Marker;
    private data: DataPublish = {
        name: "",
        location: null,
        nameLocation: "",
        image: ""
    };

    notyf = new Notyf();

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.adoptedStyleSheets = [...globalStyles, styles, mapboxStyles];
    };

    connectedCallback() {
        this.render();
        // Pisa el position:absolute y el height:100% que omni-router
        // le aplica vía su clase interna ".page"
        this.style.position = "static";
        this.style.height = "auto";
        this.style.width = "100%";

        this.dropzone();
        this.mapbox();
        // this.showLocatiosResults();

        const formPublish = this.shadowRoot!.querySelector(".form-publish");
        formPublish?.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = this.shadowRoot!.getElementById("input-name") as HTMLInputElement;
            this.data.name = name!.value;
            this.handleProcess();
        });

    };

    disconnectedCallback() {
        this.map?.remove();
        this.marker?.remove();
    };

    private mapbox() {
        const mapContainer = this.shadowRoot!.querySelector<HTMLElement>("#map");
        if (!mapContainer) {
            throw new Error("No se encontró el contenedor del mapa");
        };

        const map = new mapboxgl.Map({
            accessToken: MAPBOX_TOKEN,
            container: mapContainer,
            center: [-57.67636596265029, -36.31538504491035],
            zoom: 12
        });

        this.map = map;

        map.on('click', async (event) => {
            const coords = event.lngLat;
            const lng = coords.lng;
            const lat = coords.lat;
            this.setMapLocation({ lng, lat });
            this.searchByLocation(lat, lng);
        });
    };

    private drawRadius(lat: number, lng: number, radiusMeters: number) {
        // Turf usa [lng, lat] y el radio en km por defecto
        const area = circle([lng, lat], radiusMeters / 1000, {
            steps: 64,
            units: "kilometers",
        });

        const source = this.map!.getSource("radius") as mapboxgl.GeoJSONSource | undefined;

        // Si ya existe, solo actualizo los datos
        if (source) {
            source.setData(area);
            return;
        }

        this.map!.addSource("radius", { type: "geojson", data: area });

        this.map!.addLayer({
            id: "radius-fill",
            type: "fill",
            source: "radius",
            paint: { "fill-color": "#4264fb", "fill-opacity": 0.15 },
        });

        this.map!.addLayer({
            id: "radius-outline",
            type: "line",
            source: "radius",
            paint: { "line-color": "#4264fb", "line-width": 2 },
        });
    }

    private setMapLocation(location: { lng: number; lat: number }) {
        if (!this.map) return;
        this.data.location = location;

        const lngLat: [number, number] = [location.lng, location.lat];
        this.drawRadius(location.lat, location.lng, 100); // 5 km

        if (this.marker) {
            this.marker.setLngLat(lngLat);
        } else {
            this.marker = new mapboxgl.Marker()
                .setLngLat(lngLat)
                .addTo(this.map);
        };
        this.map.flyTo({ center: lngLat, zoom: 14 });
    }

    private dropzone() {
        const dropzoneContainer = this.shadowRoot!.getElementById("image-dropzone");
        if (!dropzoneContainer) {
            throw new Error("No se encontró el contenedor de carga de imágenes");
        };

        const myDropzone = new Dropzone(dropzoneContainer, {
            url: "/",            // Ruta de tu servidor
            autoProcessQueue: false,
            maxFiles: 1,                 // Limita a una sola imagen
            acceptedFiles: "image/*",    // Solo imágenes
            createImageThumbnails: true,
            thumbnailWidth: 1200,         // Aumenta el ancho generado (doble de resolución)
            thumbnailHeight: 1400,        // Aumenta el alto generado
            thumbnailMethod: "contain",  // 'contain' mantiene la proporción o 'crop' recorta
            resizeQuality: 1.0,
            dictDefaultMessage: "Arrastra los archivos aquí para subirlos"
        });

        // Ejemplo de eventos
        myDropzone.on("thumbnail", async (_file, dataUrl) => {
            const dropzoneContainer = this.shadowRoot!.getElementById("image-dropzone");
            this.data.image = dataUrl;

            // Ocultamos el mensaje de texto inicial
            this.shadowRoot!.getElementById("dropzone-text")!.style.display = "none";

            // Si ya existe una imagen previa dentro del contenedor, la eliminamos
            const existingImg = dropzoneContainer!.querySelector(".preview-img");
            if (existingImg) {
                existingImg.remove();
            };

            // Creamos la nueva imagen con el resultado y la insertamos en el contenedor
            const img = document.createElement("img");
            img.src = dataUrl;
            img.classList.add("preview-img");
            dropzoneContainer!.appendChild(img);
        });
    }

    private async searchByLocation(lat: number, lng: number) {
        const res = await reverseGeocode(lat, lng);
        const address = res.data.addresses[0].address;

        const locationEl = this.shadowRoot!.getElementById('input-location') as HTMLInputElement;

        if (res.data.addresses[0].address.streetNameAndNumber) {
            locationEl!.value = `${address.streetNameAndNumber}, ${address.municipality}, ${address.countrySubdivision}`
        } else {
            locationEl!.value = "";
        };
    };

    private async sendPublishData() {
        try {
            
            const result = validatePostData(this.data); 

            if (!result.valid) {
                Object.entries(result.errors).forEach((key) => {
                    throw new Error(key[1]);
                });
            };

            const res = await axios.post(`${API_URL}/post/create`, {
                data: this.data,
            },
                {
                    withCredentials: true
                });

            return res;
        } catch (error: any) {
            throw new Error(error.message)
        }
    };

    // private async searchByQuery(query: string) {
    //     const API_KEY = `VVbFGJEMFqNM8SmqraryVTyddJZj6507`;
    //     const encodedQuery = encodeURIComponent(query);
    //     const url = `https://api.tomtom.com/search/2/search/` +
    //         encodedQuery +
    //         `.json?` +
    //         `key=${API_KEY}` +
    //         `&countrySet=AR` +
    //         `&limit=3` +
    //         `&typeahead=true`

    //     const response = await fetch(url);
    //     const data = await response.json();

    //     return data;
    // };

    // private showLocatiosResults() {

    //     const inputLocation = this.shadowRoot!.getElementById("input-location") as HTMLInputElement;
    //     let debounceTimer: any;

    //     const renderResults = (places: any) => {
    //         if (resultsList) {
    //             resultsList.innerHTML = '';

    //             if (!places || places.length === 0) {
    //                 const li = document.createElement('li');
    //                 li.textContent = 'No se encontraron resultados en esta zona';
    //                 resultsList.appendChild(li);
    //                 resultsList.style.display = 'block';
    //                 return;
    //             }

    //             places.forEach((place: any) => {
    //                 const li = document.createElement('li');
    //                 li.textContent = place.address.freeformAddress;

    //                 li.addEventListener('click', () => {
    //                     inputLocation.value = place.address.freeformAddress;
    //                     resultsList.style.display = 'none';
    //                     this.setMapLocation({ lng: place.position.lon, lat: place.position.lat });
    //                 });
    //                 resultsList.appendChild(li);
    //                 resultsList.style.display = 'block';
    //             });

    //         };
    //     };

    //     const resultsList = this.shadowRoot!.getElementById("results-list");
    //     inputLocation.addEventListener("input", () => {
    //         const query = inputLocation.value;

    //         clearTimeout(debounceTimer);

    //         if (query.length < 3 && resultsList) {
    //             resultsList.style.display = 'none';
    //             return;
    //         };

    //         if (query) {
    //             debounceTimer = setTimeout(async () => {
    //                 const res = await this.searchByQuery(query);
    //                 renderResults(res.data);
    //             }, 500);
    //         };
    //     });
    // };

    private async handleProcess() {
        const btn = this.shadowRoot!.querySelector(".status-btn") as HTMLButtonElement;

        if (!btn) return;

        btn!.className = 'status-btn is-loading';
        btn.disabled = true;

        try {
            await this.sendPublishData();
            btn.className = `status-btn is-success`;
            setTimeout(() => {
                window.location.href = "/";
            }, 2500);

        } catch (error: any) {
            btn.className = `status-btn is-error`;
            this.notyf.error(error.message);
        };

        setTimeout(() => {
            btn!.className = 'status-btn';
            btn.disabled = false;
        }, 2500);

    };

    render() {
        this.shadowRoot!.innerHTML = `
        <div class="container">
            <div class="info-page">
                <h1 class="title">Reportar mascota</h1>
                <p class="subtitle">Ingresá la siguiente información para realizar el reporte de la mascota</p>
            </div>
            <form class="form form-publish dropzone" id="form-publish">
                <fieldset class="form__fielset">
                    <div class="form__input-contaier">
                        <label class="label form__label" for="">NOMBRE</label>
                        <input class="input form__input" type="name" name="firstname" autocomplete="given-name" id="input-name" placeholder="Nombre de mascota" required>
                    </div>
                    <div class="upload-box" id="image-dropzone">
                        <div id="dropzone-text" class="upload-message">
                           Arrastra la imagen deseada aquí o <strong>presiona para subirla</strong>
                        </div>
                    </div>
                
                    <div class="map">
                        <p class="map__text">
                        Seleccioná un punto de referencia en el mapa o ingresá una dirección para buscarla en el mapa.</p>
                        <div id="map" class="mapbox-view"></div>
                    </div>
                    <div class="form__input-contaier">
                        <label class="label form__label" for="">UBICACÍON</label>
                        <input id="input-location" class="input form__input" type="text" placeholder="Dirección o lugar de referencia" required>
                        <ul id="results-list" class="results-list"></ul>
                    </div>
                </fieldset>
            </form>
            <button class="status-btn" type="submit" form="form-publish">
                <span class="btn-text">Reportar mascota</span>

                <div class="loader-wrapper">
                    <div class="loader"></div>
                </div>

                <i class="icon success-icon">${checkIcon}</i>
                <i class="icon error-icon">${xIcon}</i>
            </button>
        </div>`;
    };
};

customElements.define("postcreate-page", PostCreate);