// client/src/router/router.ts
import { Router } from "@capitec/omni-router";
import "../components/header/header";
import "../components/items/card";
import "../components/items/cardsContainer";
import "../components/reportForm/reportForm";
import { authGuard } from "./guards";


Router.addRoute({
    name:"home",
    tag: "home-page",
    title:"PetFinder",
    path:"/",
    load: () => import("../pages/home/home")
});

Router.addRoute({
    name:"login",
    tag: "login-page",
    title:"Iniciar sesión | PetFinder",
    path:"/login",
    load: () => import("../pages/login/login")
});

// Router.addRoute({
//     name:"myAccount",
//     tag: "my-account",
//     title:"Mi cuenta | PetFinder",
//     path:"/my-account",
//     load: () => import("../pages/myAccount/myAccount"),
//     guard: authGuard
// });


Router.addRoute({
    name:"register",
    tag: "register-page",
    title:"Registrarse | PetFinder",
    path:"/register",
    load: () => import("./../pages/register")
});

Router.addRoute({
    name:"petReport",
    tag: "petReport-page",
    title:"Publicar | PetFinder",
    path:"/publish",
    load: () => import("./../pages/register")
});

Router.addRoute({
    name: "postCreate",
    tag: "postcreate-page",
    title:"Crear publicación | PetFinder",
    path: "/nueva-publicacion",
    load: () => import("../pages/postCreate/postCreate"),
    guard: authGuard
});

Router.addRoute({
    name: "misMascotas",
    tag: "mis-mascotas-page",
    title:"Mis mascotas | PetFinder",
    path: "/mis-mascotas",
    load: () => import("../pages/misMascotas/misMascotas"),
    guard: authGuard
});

Router.addRoute({
    name: "myAccount",
    tag: "my-account-page",
    title:"Mi cuenta | PetFinder",
    path: "/mi-cuenta",
    load: () => import("../pages/myAccount/myAccount"),
    guard: authGuard
});

Router.load();
