
import express  from "express";
import {config} from 'dotenv'
import morgan from "morgan";
import routerIndex from "./routes/indexRouter.js";

const app = express()


config({'path': './.env'})


const port = process.env.PORT_GATEWAY  || 5000

app.use(routerIndex)
app.use(morgan('combined'))

app.listen(port, () => {
    console.log("server on port "+port);
})