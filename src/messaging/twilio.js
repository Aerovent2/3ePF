import twilio from 'twilio'
import * as dotenv from 'dotenv'
import logguer from '../logs/logger.js'

dotenv.config()

const accountSID="AC2a3588b32cf95b303774454294f9cf5e"
const authToken=process.env.TWILIO_TOKEN
const client= twilio(accountSID,authToken)

async function sms({mensaje,numero}){
    try{
        await client.messages.create({
        body:mensaje,
        from:"+17754061518",
        to:numero
        })
    }catch(err){
        logguer.error(`error al enviar sms ${err}`)
    }
}

async function whatsapp({mensaje,numero}){
    try{
        await client.messages.create({
        body:mensaje,
        from:"whatsapp:+17754061518",
        to:`whatsapp:${numero}`
        })
    }catch(err){
        logguer.error(`error al enviar sms ${err}`)
    }
}


export {sms,whatsapp}