import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'
import { createRequire } from 'module'
import { google } from 'googleapis'

const app = express();

const require = createRequire(import.meta.url)
const OAuth2 = google.auth.OAuth2;

const { GMAIL_USER, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, PORT } = process.env;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => res.send('Hello'))


app.post('/submit-form',  (req, res) => {
    const { email, firstName, message } = req.body;
    
    const createTransporter = async () => {

        const oauth2Client = new OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
        );
    
        oauth2Client.setCredentials({
        refresh_token: REFRESH_TOKEN
        });
    
        const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    reject('Failed to create access token.')
                }
                resolve(token);
            });
        });
    
        const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: `${GMAIL_USER}`,
            accessToken,
            clientId: `${CLIENT_ID}`,
            clientSecret: `${CLIENT_SECRET}`,
            refreshToken: REFRESH_TOKEN
            }
        });

        return transporter;
    }

    const info = async (emailOptions) => {
        let emailTransporter = await createTransporter();
        await emailTransporter.sendMail(emailOptions)
    }

    info({
        from: `${email}`,
        to: `${GMAIL_USER}`,
        subject: 'Portfolio Contact Form',
        text: `${firstName} says ${message}`
    });

    res.send('Success')
});


app.listen(PORT)