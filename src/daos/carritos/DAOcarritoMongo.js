import Contenedor from "../../containers/containerMongo.js";
import logguer from "../../logs/logger.js";

class DAOcarritosMongo extends Contenedor{
    constructor(){
        super('carritos',{
            productos: {type:Array, default:[]},
            timestamp: {type: String, required:true, default: new Date()},
            finished:{type:Boolean, default:false}
            })
    }
    async updateCarritoById(idCarrito,producto){
        try{
            const carritoPrevio= await super.getById(idCarrito)
            //falta hacer que sume cantitad de productos iguales
            carritoPrevio.productos.push(producto)
            const resutl =await this.db.updateOne({_id:idCarrito},{productos:carritoPrevio.productos})
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
            let productos = carritoPrevio.productos
            let filtrado= productos.filter(objeto => objeto._id !=  id_prod) 
            carritoPrevio.productos = filtrado           
            const resutl =await this.db.updateOne({_id:idCarrito},{productos:carritoPrevio.productos})
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
}

export default DAOcarritosMongo


