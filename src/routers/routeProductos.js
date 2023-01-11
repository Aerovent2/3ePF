import express from 'express'

import daos from '../daos/index.js'
import { auth, isAdmin } from '../sessions/authMiddlewares.js'
import logguer from '../logs/logger.js'

const { Router } = express
const routerProductos = Router()

const DB = daos.DAOproductos


routerProductos.get('/', auth, async (req, res) => {//
    try {
        const data = await DB.getAll()
        logguer.info(`lista de productos enviada `)
        return res.status(200).send(data)
    } catch (err) {
        logguer.error(`error en get all productos${err}`)
        res.status(400).send({ error: err })
    }
})

routerProductos.get('/:id', auth, async (req, res) => {//
    try {
        const { id } = req.params
        const data = await DB.getById(id)
        if (data) {
            logguer.info(` producto con id ${id}enviado `)
            res.status(200).send(data)
        } else {
            logguer.warn(`producto con id ${id} no encontrado`)
            res.status(404).send({ error: 'producto no encontrado' })
        }
    } catch (err) {
        logguer.warn(`error en get producto por id ${err}`)
        res.status(404).send({ error: err })
    }
})

routerProductos.post('/', auth, isAdmin, async (req, res) => {//
    const { nombre, descripcion, codigo, url, precio, stock } = req.body
    if (!nombre || !descripcion || !codigo || !url || !precio || !stock) {
        logguer.warn('faltan datos del nuevo producto o son incorrectos')
        return res.status(406).send({ error: 'faltan datos del nuevo producto o son incorrectos' })
    }
    const producto = { nombre, descripcion, codigo, url, precio: parseFloat(precio), stock: parseInt(stock) }
    try {
        const data = await DB.save(producto)
        producto.id = data
        logguer.info(`creado nuevo producto id ${data} `)
        res.send(producto)
    } catch (err) {
        logguer.error(`error en post nuevo producto${err}`)
        res.send({ error: true, err })
    }
})
routerProductos.put('/:id', auth, isAdmin, async (req, res) => {//
    const { nombre, descripcion, codigo, url, precio, stock } = req.body
    if (!nombre & !descripcion & !codigo & !url & !precio & !stock) {
        logguer.warn(`error al actualizar producto compruebe datos body${err}`)
        return res.status(406).send({ error: 'error en mascara de entrada' })
    }
    const { id } = req.params
    const producto = { id, nombre, descripcion, codigo, url, precio: parseFloat(precio), stock: parseInt(stock) }
    try {
        const data = await DB.updateById(producto)
        if (data) {
            logguer.info(`producto id ${id} actualizado `)
            res.status(200).send(data)
        } else {
            logguer.warn(`error al actualizar producto con id ${id} producto inexistente`)
            res.status(404).send({ error: 'producto no encontrado' })
        }
    } catch (err) {
        logguer.error(`error en put productos${err}`)
        res.send({ error: true, err })
    }
})

routerProductos.delete('/:id', auth, isAdmin, async (req, res) => {//
    const { id } = req.params
    try {
        const data = await DB.deleteById(id)
        if (data) {
            logguer.info(`producto con id ${id} eliminado`)
            res.status(200).send(data)
        } else {
            logguer.warn(`no se pudo borrar producto con id ${id} `)
            res.status(404).send({ error: 'producto no encontrado' })
        }
    } catch (err) {
        res.send({ error: true, err })
    }
})

routerProductos.delete('/', auth, isAdmin, async (req, res) => {//
    try {
        const data = await DB.deleteAll()
        if (data) {
            logguer.warn(`se borraron todos los productos `)
            res.status(200).send(data)
        } else {
            logguer.warn(`error al borrar todos los productos`)
            res.status(404).send({ error: 'producto no encontrado' })
        }
    } catch (err) {
        logguer.error(`error al eliminar todos los productos ${err} `)
        res.send({ error: true, err })
    }
})


export { routerProductos, DB }