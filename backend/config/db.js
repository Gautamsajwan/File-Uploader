import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const mongoURI = process.env.mongoURI

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI)
        console.log('connected to mongoDB')
    } catch (err) {
        console.error(err)
    }
}

export {connectToMongo}