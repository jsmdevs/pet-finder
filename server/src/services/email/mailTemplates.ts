// templates/mailTemplates.js

export function reportePerdidaTemplate({ reporterEmail }:any) {
    return {
        subject: `¡Reportaron a tu mascota!`,
        html: `<p>Un usuario reportó a tu mascota en una zona. Comunicate para más información.</p>`,
    };
}

export function welcomeTemplate(nombreUsuario:any) {
    return {
        subject: `¡Bienvenido a PetFinder, ${nombreUsuario}!`,
        html: `<p>Hola ${nombreUsuario}, gracias por sumarte a PetFinder.</p>`,
    };
};

export function resetPasswordTemplate({ resetLink }:any) {
    return {
        subject: `Restablecé tu contraseña`,
        html: `<p>Hacé click <a href="${resetLink}">acá</a> para restablecer tu contraseña.</p>`,
    };
};

