import bcrypt from 'bcrypt'

import Contenedor from "../../containers/containerMongo.js";
import logguer from '../../logs/logger.js';

 class DAOusersMongo extends Contenedor{
    constructor(){
        super('users',{
                email: { type: String, required: true },
                password: { type: String, required: true },
                username: { type: String, required: true, unique: true },
                address:{type: String, required: true},
                age:{type: Number, required: true},
                phone:{type: String, required: true},
                photo:{type: String, required: false, default: ""},
                admin:{type:Boolean, default:false},
                carts:{type:Array, default:[]}
        })
        
    }
    
     register =async (req,username,password, done)=>{
        try{
            const {email,address,age,phone}=req.body
            let photo= "/avatar.jpg"
            if(req.file.path !== undefined){
                photo =req.file.filename
            }
            const user = await this.db.findOne({username})
                if(user) return done(null,false)
                let hashPass= bcrypt.hashSync(password,bcrypt.genSaltSync(10))
                const newUser =await this.db.create({username,password:hashPass,email,address,age,phone,photo,carts:[]})
                logguer.info(`nuevo usuario registrado `)
                done(null,newUser)
        }
        catch(err){
            logguer.error(`hubo un error al registrar usuario  ${err}`)
        }
    }
    
    login= async(username,password, done)=>{
        try{
            const user = await this.db.findOne({username})
            if(!user) return done(null,false)
            bcrypt.compareSync(password,user.password)? done(null,user): done(null,false)     
        }catch(err){
            logguer.error(`hubo un error al loguear usuario  ${err}`)
        }
    }
    
    find= async(id, done)=>{
        try{
            this.db.findById(id,done) 
        }catch(err){
            logguer.error(`hubo un error al deserializar usuario  ${err}`)
        }
    }

    addCart= async(idCarrito,idUser)=>{
        try{
           const user= await this.db.findById(idUser) 
           user.carts.push(idCarrito)
           const resutl =await this.db.updateOne({_id:idUser},{carts:user.carts})
           if(resutl.modifiedCount ===1){
            logguer.info(`carrito :${idCarrito} agregado al usuario ${idUser}`)
            return user.carts
        }else{
            logguer.warn(`carrito no agregado `)
            return {error: "Carrito no encontrado"}
        }  
        }catch(err){
            logguer.error(`hubo un error al agregar carrito al usuario  ${err}`)
        }
    } 
}
 


export default DAOusersMongo 