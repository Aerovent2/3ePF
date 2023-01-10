import  express from "express"
import {Server as HTTPServer} from "http"
import session from "express-session"
import * as dotenv from 'dotenv'
import ParseArgs from 'minimist'
import cluster from "cluster"
import mongoose from "mongoose"


import config from './src/config.js'
import routerUser from "./src/routers/routeUser.js"
import {routerProductos} from './src/routers/routeProductos.js'
import routerCarrito from './src/routers/routeCarrito.js'
import sessionOptions from "./src/sessions/session.js"
import passport from "./src/sessions/passport.js"
import logger from "./src/logs/logger.js"

let{modo}=ParseArgs(process.argv.slice(2))
const PORT = process.env.PORT|| 8081

mongoose.connect(config.mongoDB.uri, config.mongoDB.options)

const serverExpress = ()=>{
    dotenv.config()

    const app = express()
    const httpServer= new HTTPServer(app)
  
    app.use((req,res,next)=>{
        logger.info(`Request ${req.method} at ${req.url}`)
        next()
    })

    app.use(express.static('./src/views'))
    app.use(express.static('public/perfiles'))
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(session(sessionOptions)) 

    app.use(passport.initialize())
    app.use(passport.session())

    app.use('/',routerUser)
    app.use('/api/productos',routerProductos)
    app.use('/api/carrito',routerCarrito)

    app.all('*',(req,res)=>{
        logger.warn(`Request ${req.method} at ${req.url} not found`)
        res.send({error:'Ruta no implementada'})
    })
    
    httpServer.listen(PORT, ()=>{logger.info(`servidor con pid ${process.pid} escuchando en el puerto ${httpServer.address().port}`)})
    httpServer.on('error',error=>logger.error(`Error en servidor ${error}`))
}

    if(modo === 'cluster'){
        if(cluster.isPrimary){
            for(let i =0; i<3/* cpus().length */;i++){// Si le pongo todos los nucleos me crashea mongo atlas
                cluster.fork()
            }
            logger.info(`primary pid ${process.pid}`)
            cluster.on('exit',(worker,code,signal)=>{
                logger.warn(`Worker with id ${worker.process.pid} Killed`)
                cluster.fork()
            })
        }else{
           serverExpress()
        }
    }else{
        serverExpress()
    }
    


