import express from "express";
import mongoose from "mongoose";
import 'dotenv/config'
import {errorHandler} from "./core/middleware/errorHandler.js";
import AuthenticationRouter from "./feature/authentication/AuthenticationRouter.js";
import FilesRouter from "./feature/file/FilesRouter.js";
import path from "node:path";
import fileUpload from "express-fileupload";
import {fileURLToPath} from "url";
import UserRouter from "./feature/user/UserRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;

app.use(fileUpload({}))
app.use(express.json());

app.use('/api/',AuthenticationRouter)
app.use('/api/',FilesRouter)
app.use('/api/',UserRouter)

app.use(errorHandler);

export function getBaseDirectory(){
    return path.dirname(fileURLToPath(import.meta.url))
}

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
