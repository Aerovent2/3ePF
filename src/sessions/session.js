import MongoStore from "connect-mongo" 
import * as dotenv from 'dotenv'

dotenv.config()

 const sessionOptions= {
    secret:process.env.SECRET_SESSION,
    resave:true,
    rolling:true, //resetea el tiempo de expiracion al tener session activa
    saveUninitialized:false,
    cookie:{maxAge:600000},//expira en 10 min si no hay actividad
    store: MongoStore.create({
        mongoUrl:process.env.DB_SESION,
        mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true},
    })
}
export default sessionOptions