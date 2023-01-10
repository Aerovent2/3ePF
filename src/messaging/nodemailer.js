import {createTransport} from "nodemailer"
import logguer from "../logs/logger.js"

async function run({subject,html,email}){
    const transporter= createTransport({
        host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'malika.hegmann@ethereal.email',
        pass: 'aHnsNCgpWkARzwQjE6'
    }
    })

    const opts = await transporter.sendMail({
        from: 'malika.hegmann@ethereal.email',
        to: email,
        subject,
        html
    })

    try{
        const info = await transporter.sendMail(opts)
        logguer.info(info)
    }catch(err){
        logguer.error(`error al enviar mail ${err}`)
    }
}

export default run
//run({subject,html,email})