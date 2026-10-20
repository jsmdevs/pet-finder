import { Router } from "@capitec/omni-router";
import { checkAuth } from "./auth";
import { withLoader } from "../lib/loader";

export const authGuard = () =>
    withLoader(async () => {
        const allowed = await checkAuth();
        if (!allowed) Router.replace("/login");
        return allowed;
    });