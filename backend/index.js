import express from 'express'
import cors from 'cors'
import { connectToMongo } from './config/db.js'
import FileRoutes from './routes/FileRoutes.js'

const app = express()
connectToMongo()
const port = process.env.port

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("hello world")
})
app.use('/file', FileRoutes)

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})