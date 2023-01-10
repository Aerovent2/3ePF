import Contenedor from '../../containers/containerFs.js'
import fs from 'fs'

class DAOcarritosFs extends Contenedor{
    constructor(){
        super('carritos.json')
    }
    async existe(){
        let buscarArchivos= await fs.promises.readdir(this.ruta)
        let existe= buscarArchivos.find(archivo => archivo=== this.nombreDeArchivo)
        return existe
    }
    async leer(){
        let leer = await fs.promises.readFile(`${this.ruta}/${this.nombreDeArchivo}`, 'utf-8')
        let parsed =  JSON.parse(leer)
        return parsed
    }
    async  save(){//
        let carritos = []
        let carrito={}
        try{
            
            if(this.existe()){
                
                let existente = await fs.promises.readFile(`${this.ruta}/${this.nombreDeArchivo}`, 'utf-8')
                if(existente !== ''){
                     carritos = JSON.parse(existente)
                     if(carritos.length > 0){
                        let maxId = carritos[0].id
                        for(let i =0; i< carritos.length; i++){
                            if(maxId < carritos[i].id){
                                maxId=carritos[i].id
                            }
                        carrito.id = maxId+1
                        }
                     }else{
                        carrito.id=1
                     }
                }
            }else{
                carrito.id=1
            }
            carrito.productos=[]
            carrito.timestamp = new Date()
            carritos.push(carrito)
            await fs.promises.writeFile(`${this.ruta}/${this.nombreDeArchivo}`, JSON.stringify(carritos))
            return carrito.id
        }catch(err){
            console.error(`hubo un error al guardar el archivo : ${err}`)
        }
    }
    async updateCarritoById(idCarrito,producto){//
        try{
            if (this.existe()){
                let desdeFs = await this.leer()
                let encontrado =  desdeFs.findIndex(objeto => objeto.id === parseInt(idCarrito) )
                if(encontrado != -1){
                    if(producto === null){
                        return {error: 'id de producto no encontrado'}
                    }
                    desdeFs[encontrado].productos.push(producto)
                    await fs.promises.writeFile(`${this.ruta}/${this.nombreDeArchivo}`, JSON.stringify(desdeFs))
                    return desdeFs[encontrado]
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
            if (this.existe()){
                let desdeFs = await this.leer()
                let encontrado =  desdeFs.findIndex(objeto => objeto.id === parseInt(idCarrito) )
                if(encontrado != -1){
                    let filtrado= desdeFs[encontrado].productos.filter(objeto => objeto.id !== parseInt(id_prod) )
                    desdeFs[encontrado].productos= filtrado
                    await fs.promises.writeFile(`${this.ruta}/${this.nombreDeArchivo}`, JSON.stringify(desdeFs))
                    return desdeFs[encontrado] 
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


