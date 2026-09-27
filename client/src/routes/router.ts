// client/src/router/router.ts
import { Router } from "@capitec/omni-router";
import "../components/header/header";
import "../components/items/card";
import "../components/items/cardsContainer";
import "../components/reportForm/reportForm";


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
    name:"postCreate",
    tag: "postcreate-page",
    title:"Crear publicación | PetFinder",
    path:"/nueva-publicacion",
    load: () => import("../pages/postCreate/postCreate")
});

// Router.addRoute({
//     name: "create-pet-page",
//     path: "/create",
//     load: () => import("../pages/create-pet-page"),
//     guard: async () => {
//         const allowed = await checkAuth();
//         if (!allowed) Router.replace("/login");
//         return allowed;
//     },
// });

Router.load();
