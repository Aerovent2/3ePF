import passport from "passport"
import {Strategy} from 'passport-local'

import daos from '../daos/index.js'

const {register,login,find}= daos.DAOusers


passport.use('register', new Strategy({passReqToCallback:true},(req,username,password, done)=>register(req,username,password, done)))

passport.use('login', new Strategy({},(username,password, done)=>login(username,password, done)))

passport.serializeUser((user,done)=>{done(null,user._id)})

passport.deserializeUser((id,done)=>{find(id,done)})

export default passport