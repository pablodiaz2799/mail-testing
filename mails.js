const port = process.env.PORT || 3000
const express = require('express');
const app = express();
const cors = require('cors');

const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const {google} = require("googleapis");
const OAuth2 = google.auth.OAuth2;

require('dotenv').config();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const gmail_user = 'even.clients@gmail.com';
const oauth_client = '1001291194112-grq5aej39c3b1tn48s9j9ffg3are0l8e.apps.googleusercontent.com';
const oauth_secret = 'IQsspdml8onLa6SGF3GG0uo-';
const refresh_token = '1//04k2ywuSyQTl3CgYIARAAGAQSNwF-L9IraqM_-wk-gN3-SfvGw2HQdS5cvzUwtGsXH2SRVcHorQXELJXYQ2-AH3HalDOEVhpMXA0';
const destination_email = 'info@even.la'

app.use(cors());

app.get('/sendEmail', cors(), (req, res, next) => {
    console.log(req.body)

    const output = `<h1>Nueva solicitud de contacto</h1>
  <h3>Detalles de contacto</h3>
  <li><b>Nombre: </b> ${req.query.name}</li>
  <li><b>Teléfono: </b> ${req.query.tel}</li>
  <li><b>Email: </b> ${req.query.email}</li>
  <h3>Mensaje</h3>
  <p>${req.query.message}</p>`;

    const oauth2Client = new OAuth2(
        oauth_client,
        oauth_secret,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: refresh_token
    });
    const accessToken = oauth2Client.getAccessToken();

    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: gmail_user,
            clientId: oauth_client,
            clientSecret: oauth_secret,
            refreshToken: refresh_token,
            accessToken: accessToken
        }
    });

    const mailOptions = {
        from: "Even contact form",
        //to: "jo.umpierrez@gmail.com",
        to: destination_email,
        subject: "Nueva solicitud de contacto",
        html: output
    };

    smtpTransport.sendMail(mailOptions, (error, response) => {
        error ? console.log(error) : console.log(response);
        smtpTransport.close();
    });

    res.send('Email sent!');
})

app.listen(port, function () {
    console.log('Mail server running on port 3000!');
});