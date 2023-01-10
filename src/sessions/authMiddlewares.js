import logger from "../logs/logger.js"

const auth = (req,res,next)=>{
    logger.info(`request de autorizacion`)
    req.isAuthenticated()? next(): res.redirect('/login')
}

const isAdmin = (req,res,next)=>{
   
     if(req.user.admin=== true){
        logger.info(`credenciales de administrador`)
        next()
    }else{
        logger.warn(`intento de acceso a zona protegida`)
        res.status(401).send({error: `ruta: /api/productos${req.url} necesita permisos de administrador }`})
    } 
}

export {auth,isAdmin}