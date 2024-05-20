const express = require('express');
const basicAuth = require('express-basic-auth')
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3003;

const nodemailer = require('nodemailer');
const path = require('path');
const { EMAIL, PASSWORD } = require('./env.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*'
}));

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});

app.post("/api/postventamailing", async (req, res) => {
    const recipientName = req.body.name
    const recipientEmail = req.body.email

    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        tls: {
            ciphers: "SSLv3",
            rejectUnauthorized: false,
        },
        auth: {
            user: EMAIL,
            pass: PASSWORD,
        },
    });
    // send mail with defined transport object
    try {
        const info = await transporter.sendMail({
            from: '"Inmobiliaria Galilea" <inmobiliaria@galilea.cl>', // sender address
            to: `${recipientName}, ${recipientEmail}`, // list of receivers
            subject: "Solicitud de Post Venta", // Subject line
            // text: "Hola, esto es un test", // plain text body
            html: `<img src="cid:img" height="600px" />`, // html body
            attachments: [
                {
                    filename: "postventa.jpg",
                    path:path.join(__dirname, './assets/SolicitudPostVenta.jpg'), // path contains the filename, do not just give path of folder where images are reciding.
                    cid: "img", // give any unique name to the image and make sure, you do not repeat the same string in given attachment array of object.
                },
            ],
        });

        console.log("Message sent: %s", info.messageId);
        res.send('OK')
    }
    catch (e) {
        console.log('Error al enviar correo', e)
    }

});
 
