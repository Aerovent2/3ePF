import twilio from 'twilio'
import * as dotenv from 'dotenv'
import logguer from '../logs/logger.js'

dotenv.config()

const accountSID = "AC2a3588b32cf95b303774454294f9cf5e"
const authToken = process.env.TWILIO_TOKEN
const num = process.env.TWILIO_NUM
const client = twilio(accountSID, authToken)



function sms(datos) {

    let mensaje = `
    Hola ${datos.usuario.username}
    Su pedido fue realizado con exito
    Nº de referencia ${datos.id}
    `
    let numero = datos.usuario.phone

    const enviarSms = async () => {
        try {
            await client.messages.create({
                body: mensaje,
                from: num,
                to: numero
            })
        }
        catch (err) {
            logguer.error(`error al enviar sms ${err}`)
        }
    }
    logguer.info(`sms de compra enviado a ${numero}`)
    console.log(mensaje)
    //enviarSms()
}



async function whatsapp(datos) {

    let productos = datos.productos
    let comprados = ``
    let total = 0
    Object.entries(productos).forEach(([key, value]) => {
        comprados = comprados + `
            Item:${value.producto.nombre}
            Precio Unitario:$ ${value.producto.precio} 
            Cantidad:${value.cant}
            Subtotal :$${value.producto.precio * value.cant}

            -------------------------------
            `
        total = total + (value.producto.precio * value.cant)
    });


    let body = ` 
        Nombre:${datos.usuario.username}
        Email: ${datos.usuario.email}
        Detalle de la Compra:
        //////////////////////////////////////////////////////////////////
        ${comprados}
        TOTAL COMPRA:$ ${total}
        //////////////////////////////////////////////////////////////////
        `
   
    const enviarWhatsapp = async () => {
        try {
            await client.messages.create(
                {
                    body,
                    from: "whatsapp:" + num,
                    to: `whatsapp:${datos.usuario.phone}`
                })
        } catch (err) {
            logguer.error(`error al enviar whatsapp ${err}`)
        }
    }
    logguer.info('whatsapp de pedido enviado')
    console.log(body)
    //enviarWhatsapp()
}


export { sms, whatsapp }