import Contenedor from '../../containers/containerMemoria.js'
import fs from 'fs'

class DAOcarritosFs extends Contenedor{
    constructor(){
        super()
        this.carritos=[]
    }
    
    save(){//
        let carrito={}
        try{
            if(this.carritos){
                if(this.carritos.length > 0){
                    let maxId = this.carritos[0].id
                    for(let i =0; i< this.carritos.length; i++){
                        if(maxId < this.carritos[i].id){
                            maxId=this.carritos[i].id
                        }
                    carrito.id = maxId+1
                    }
                }else{
                    carrito.id=1
                }
            }else{
                carrito.id=1
            }
            carrito.productos=[]
            carrito.timestamp = new Date()
            this.carritos.push(carrito)
            return carrito.id
        }catch(err){
            console.error(`hubo un error al guardar el archivo : ${err}`)
        }
    }
     updateCarritoById(idCarrito,producto){//
        try{
            if (this.carritos){
                let encontrado =  this.carritos.findIndex(objeto => objeto.id === parseInt(idCarrito) )
                if(encontrado != -1){
                    if(producto === null){
                        return {error: 'id de producto no encontrado'}
                    }
                    this.carritos[encontrado].productos.push(producto)
                    
                    return this.carritos[encontrado]
                }else{
                    return {error: "Carrito no encontrado"}
                } 
            }
        }catch(err){
            console.log(`hubo un error al actualizar por id : ${err}`)
        } 
    }
        
    
    async deleteProductoById(idCarrito,id_prod){//
        try{
            if (this.carritos){
                let encontrado =  this.carritos.findIndex(objeto => objeto.id === parseInt(idCarrito) )
                if(encontrado != -1){
                    let filtrado= this.carritos[encontrado].productos.filter(objeto => objeto.id !== parseInt(id_prod) )
                    this.carritos[encontrado].productos= filtrado
                    return this.carritos[encontrado] 
                }else{
                    return {error: "Carrito no encontrado"}
                } 
            }
        }catch(err){
            console.log(`hubo un error al borrar producto por id : ${err}`)
        } 
    }
}

export default DAOcarritosFs


