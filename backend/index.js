import express from "express";
import mongoose from "mongoose";
import 'dotenv/config'
import {errorHandler} from "./core/middleware/errorHandler.js";
import AuthenticationRouter from "./feature/authentication/AuthenticationRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;

app.use(express.json());

app.use(AuthenticationRouter)

app.use(errorHandler);

const start = async () => {
    try {
        await mongoose.connect(MONGODB_URL);

        app.listen(PORT, ()=>{
            console.log(`Server started listening on port: ${PORT}`)
        })
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

start();
