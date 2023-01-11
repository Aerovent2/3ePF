import Contenedor from "../../containers/containerMongo.js";
import logguer from "../../logs/logger.js";
import correo from '../../messaging/nodemailer.js'
import {sms,whatsapp} from '../../messaging/twilio.js'


class DAOcarritosMongo extends Contenedor{
    constructor(){
        super('carritos',{
            productos: {type:Object, default:{}},
            timestamp: {type: String, required:true, default: new Date()},
            finished:{type:Boolean, default:false}
            })
    }

    async updateCarritoById(idCarrito,producto){
        try{
            const carritoPrevio= await super.getById(idCarrito)
            let prod=carritoPrevio.productos
            if(prod.hasOwnProperty(producto._id)){
                console.log('aumenta cantidad')
                let cant=prod[producto._id].cant + 1 
                let nuevo= {producto,cant}
                prod[producto._id]=nuevo
            }else{
                console.log('agregado por primera vez')
                let nuevo= {producto,cant:1}
                prod[producto._id]=nuevo
            }
            const resutl =await this.db.updateOne({_id:idCarrito},{productos:prod})
            if(resutl.modifiedCount ===1){
            logguer.info('carrito updated')
            return carritoPrevio
            } 
        }catch(err){
            logguer.error(`error en updateCarrito by id ${err} `)
        }
    }

    async deleteProductoById(idCarrito,id_prod){//
        try{
            const carritoPrevio= await super.getById(idCarrito)
            let prod=carritoPrevio.productos
            if(prod.hasOwnProperty(id_prod)){
                if(prod[id_prod].cant<2)delete prod[id_prod]
                else{
                    prod[id_prod].cant--
                }
            }else{
                logguer.warn(`error al borrar producto : ${id_prod} del carrito: ${idCarrito}  `)
            }
            const resutl =await this.db.updateOne({_id:idCarrito},{productos:prod})
            if(resutl.modifiedCount ===1){
                logguer.info(`producto ${id_prod} del carrito ${idCarrito} deleted `)
                return carritoPrevio
            }else{
                logguer.warn(`error al borrar producto : ${id_prod} del carrito: ${idCarrito}  `)
                return {error: "Carrito no encontrado"}
            }  
        }catch(err){
            logguer.error(`hubo un error al borrar producto por id : ${err}`)
        } 
    }

    async finalizarCompra(idCarrito,user){
        try{
            const carritoPrevio= await super.getById(idCarrito)
            let prod=carritoPrevio.productos
        
            correo('pedido',{productos:prod,usuario:user})
            
            //correo(), sms(), whtaspp()
            const resutl =await this.db.updateOne({_id:idCarrito},{finished:true})
            if(resutl.modifiedCount ===1){
                logguer.info(`compra del carrito ${idCarrito} finalizada `)
                return carritoPrevio
            }else{
                logguer.warn(`error finalizar compra  del carrito: ${idCarrito}  `)
                return {error: "Carrito no encontrado"}
            }
        }catch(err){
            logguer.error(`hubo un error al finalizr compra: ${err}`)
        }
        
    }
}

export default DAOcarritosMongo


