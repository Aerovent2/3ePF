import Contenedor from "../../containers/containerMongo.js";
import logguer from "../../logs/logger.js";



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
                console.log(carritoPrevio)
                return carritoPrevio
            }else{
                logguer.warn(`error al borrar producto : ${id_prod} del carrito: ${idCarrito}  `)
                return {error: "Carrito no encontrado"}
            }  
            
        }catch(err){
            logguer.error(`hubo un error al borrar producto por id : ${err}`)
        } 
    }
}

export default DAOcarritosMongo


