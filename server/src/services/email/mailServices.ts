// services/mailService.js
import { resend } from "./resend";
// const templates = require('../templates/mailTemplates');
import * as templates from './mailTemplates';

export async function sendMail(to: string, tipo: string, datos = {}) {
    try {
        const template = templates[tipo as keyof typeof templates];
        if (!template) throw new Error(`Tipo de mail no reconocido: ${tipo}`);

        const { subject, html } = template(datos);

        return resend.emails.send({
            from: 'PetFinder <petfinder@jsmdevs.net>',
            to,
            subject,
            html,
        });
    } catch (error) {
        throw new Error("Error al enviar el email");
    };
};