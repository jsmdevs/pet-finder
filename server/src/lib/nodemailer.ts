import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "mail.jsmdevs.net", // ej: smtp.sendgrid.net o smtp.mailtrap.live
    port: 465,
    auth: {
        user: "petfinder@jsmdevs.net",
        pass: "xC54Ngd!w8S5+O",
    },
});

const info = await transporter.sendMail({
    from: '"Mi App" <no-reply@petfinder.com>',
    to: 'joacomelgaxd@gmail.com',
    subject: 'Confirmación de cuenta',
    html: '<p>¡Bienvenido a la plataforma!</p>',
});

console.log("ID del mensaje:", info.messageId);
console.log("Respuesta del servidor:", info.response);