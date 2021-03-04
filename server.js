import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'

const app = express();
const PORT = process.env.PORT;
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PW = process.env.GMAIL_PW;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => res.send('Hello'))

app.get('/submit-form', (req, res) => res.send('Submit form'))

app.post('/submit-form',  (req, res) => {

    const { email, firstName, message } = req.body;
    
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_PW
        }
    })

    const info =  transporter.sendMail({
        from: `${email}`,
        to: GMAIL_USER,
        subject: 'Portfolio Contact Form',
        text: `${firstName} says ${message}`
    })

    info();
})

app.listen(PORT)