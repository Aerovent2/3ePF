import express from 'express'
import { auth } from '../sessions/authMiddlewares.js'
import logguer from '../logs/logger.js'
const {Router}= express
const routerCarrito=Router()


import daos from '../daos/index.js'


const {addCart}= daos.DAOusers
const dbCarrito= daos.DAOcarritos
const DB = daos.DAOproductos



routerCarrito.get('/:id/productos',auth,async (req,res)=>{//
    try{
        const {id}=req.params
        const data = await dbCarrito.getById(id)
        if(data){
            logguer.info(`lista de productos en el carrito enviada `)
           res.status(200).send(data)  
        }else{
            logguer.warn(`carrito no encontrado `)
            res.status(404).send({error:'carrito no encontrado'})
        }
    }catch(err){
        logguer.error(`error al buscar productos en el carrito ${err} `)
        res.status(404).send({error:err})
    }
})

routerCarrito.post('/', auth,async(req,res)=>{//
    try{
        const data = await dbCarrito.save()
        const idCarrito=data
        const idUser = req.user._id
        addCart(idCarrito,idUser)
        logguer.info(`se creo un nuevo carrito id ${idCarrito} para el usuario ${idUser} `)
        res.send({idCarrito})
    }catch(err){
        logguer.error(`error al crear carrito para el usuario ${idUser} : ${err}`)
            res.send({error: true, err})
        }
})


routerCarrito.post('/:id/productos',auth, async(req,res)=>{//
        const {idProducto}=req.body
        if(!idProducto){
            logguer.info(`no se encontro id producto. compruebe el body `)
            return  res.status(406).send({error: 'falta idProducto  en el req.body'})
        }
        const producto = await DB.getById(idProducto)
        const {id}=req.params
        try{
        const data = await dbCarrito.updateCarritoById(id,producto)
        if(data){
            logguer.info(`se agrego el producto id ${idProducto} al carrito ${id} `)
            res.status(200).send(data)
        }else{
            logguer.warn(`no se pudo agregar el producto id ${idProducto} al carrito ${id} `)
            res.status(404).send({error:'carrito no encontrado'})
        }
        }catch(err){
            logguer.error(`error al agregar producto al carrito ${err}`)
            res.send({error: true, err})
        }
})

routerCarrito.delete('/:id/productos/:id_prod', auth,async(req,res)=>{//
        const {id,id_prod}=req.params
        try{
        const data = await dbCarrito.deleteProductoById(id,id_prod)
        if(data){
            logguer.info(`producto ${id_prod} del carrito ${id} eliminado `)
            res.status(200).send(data)
        }else{
            logguer.warn(`no se pudo eliminar el producto id ${id_prod} del carrito ${id} `)
            res.status(404).send({error:'carrito no encontrado'})
        }
        }catch(err){
            logguer.error(`error al borrar producto ${id_prod} del carrito ${id} ${err} `)
            res.send({error: true, err})
        } 
})

routerCarrito.delete('/:id',auth, async(req,res)=>{//
    const {id}=req.params
    
    try{
    const data = await dbCarrito.deleteById(id)
    if(data){
        logguer.info(` carrito ${id} eliminado `)
        res.status(200).send(data)
    }else{
        logguer.warn(` carrito ${id} no se elimino `)
        res.status(404).send({error:'carrito no encontrado'})
    }
    }catch(err){
        logguer.error(`error al borrar el carrito id ${id} : ${err} `)
        res.send({error: true, err})
    } 
})

export default routerCarrito