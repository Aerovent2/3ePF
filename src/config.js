import * as dotenv from 'dotenv'

dotenv.config()

export default{
    mongoDB:{
        uri:process.env.DB_MONGO,
        options: {serverSelectionTimeoutMS: 5000}
    },
    firebase:{
        "type": "service_account",
        "project_id": "dbcoder-20280",
        "private_key_id": process.env.FIREBASE_KEY_ID,
        "private_key": process.env.FIREBASE_KEY,
        "client_email": "firebase-adminsdk-nknwa@dbcoder-20280.iam.gserviceaccount.com",
        "client_id": process.env.FIREBASE_ID,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": process.env.FIREBASE_CERT_URL
    }
      
}