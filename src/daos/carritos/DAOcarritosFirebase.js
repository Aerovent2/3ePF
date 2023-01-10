import Contenedor from "../../containers/containerFirebase.js";

class DAOcarritosFirebase extends Contenedor{
    constructor(){
        super('carritos')
    }
    async  save(){
        try{
          const doc= await  this.db.add({timestamp:new Date(),productos:[]})
          return doc.id
        }catch(err){
            console.error(`hubo un error al guardar el carrito : ${err}`)
        }
    }
    async updateCarritoById(idCarrito,producto){
        console.log('entro a carrito byid')
        const carritoPrevio= await super.getById(idCarrito)
        carritoPrevio.productos.push(producto)
        await this.db.doc(idCarrito).set(carritoPrevio)
        
        return carritoPrevio
        
    }
    async deleteProductoById(idCarrito,id_prod){//
        try{
            const carritoPrevio= await super.getById(idCarrito)
            let productos = carritoPrevio.productos
            let filtrado= productos.filter(objeto => objeto.id !=  id_prod) 
            carritoPrevio.productos = filtrado           
            await this.db.doc(idCarrito).set(carritoPrevio)
            
            return carritoPrevio

        }catch(err){
            console.log(`hubo un error al borrar producto por id : ${err}`)
        } 
    }
}

export default DAOcarritosFirebase


