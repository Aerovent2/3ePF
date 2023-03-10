import * as dotenv from 'dotenv'

dotenv.config()

export default{
    mongoDB:{
        uri:process.env.DB_MONGO,
        options: {serverSelectionTimeoutMS: 5000}
    },
    twilio:{
        token:process.env.TWILIO_TOKEN
    }
}