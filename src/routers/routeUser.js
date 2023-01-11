
import express from 'express'
import url from 'url'
import { join } from 'path' 
import {cpus} from "os"
import passport from '../sessions/passport.js'
import multer from 'multer'
import { auth } from '../sessions/authMiddlewares.js'
import logger from "../logs/logger.js"

//logger.warn(`intento de acceso a zona protegida`)

const {Router}= express
const router=Router()

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'public/perfiles')
    },
    filename: (req,file,cb)=>{
        cb(null, Date.now()+ '-' +file.originalname  )
    }
})
const upload=multer({storage:storage})

const __dirname = url.fileURLToPath(new url.URL('.',import.meta.url))
const rutaProdHtml=join(__dirname,"../views/products.html")
const rutaLogin =join(__dirname,"../views/login.html")
const rutaRegister =join(__dirname,"../views/register.html")
const rutaRegisterError =join(__dirname,"../views/registerError.html")
const rutaLoginError =join(__dirname,"../views/loginError.html")


router.get('/',auth,(req,res)=>{
    res.redirect("/productos")
})

router.get('/login', (req,res)=>{
    res.sendFile(rutaLogin)
}) 
router.post('/',passport.authenticate('login' ,{failureRedirect:'/loginError'} ),(req,res)=>{
    res.sendFile(rutaProdHtml)
})

router.get('/register', (req,res)=>{
    res.sendFile(rutaRegister)
}) 

router.post('/register',upload.single('photo'), passport.authenticate('register',{failureRedirect:'/registerError'}),(req,res)=>{

    res.sendFile(rutaProdHtml)
})

 router.get('/productos',auth,  (req,res)=>{
    
    res.sendFile(rutaProdHtml)
})  
router.get('/loginError',  (req,res)=>{
    res.sendFile(rutaLoginError)
}) 
router.get('/registerError',  (req,res)=>{
    res.sendFile(rutaRegisterError)
})

router.get('/user',auth, (req,res)=>{
    let carts =req.user.carts
    let cart = null
    if(carts.length<1)cart=null
    else{
        console.log('si habia carritos')
        for(let i =0;i<carts.length;i++){
            if(carts[i].finished === false){
              cart =carts[i]  
              console.log(carts[i])
            } 
        }
    }
    
    res.send({usuario:req.user.username,admin:req.user.admin,foto:req.user.photo,cart})
}) 

const cpu = cpus()

router.get('/info',(req,res)=>{
   let info ={
    process: cpu.length,
    args:process.argv.slice(2),
    So:process.platform,
    nodeVersion:process.version,
    Mem:process.memoryUsage().rss,
    path:process.argv[0],
    Pid:process.pid,
    Folder:process.cwd()
   }
    logger.info(info)
    res.send({info})
}) 

router.get('/logout', (req,res)=>{
    req.session.destroy()
    logger.info('Session cerrada')
    res.redirect("/")
}) 




export default router