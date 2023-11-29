import express, { urlencoded } from "express";
import {config} from "dotenv"
import routerIndex from "./src/routes/indexRouter.js";

config({
    'path': './.env'
})

const port = process.env.PORT_MS1 || 5001


const app = express()
app.use(express.json())

app.use(routerIndex)

app.listen(port, () => {
    console.log("microservice 1 on port "+port);
})




