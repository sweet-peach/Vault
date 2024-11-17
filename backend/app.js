import "dotenv/config";
import express from "express";
import {errorHandler} from "./core/middleware/errorHandler.js";
import AuthenticationRouter from "./feature/authentication/AuthenticationRouter.js";
import FilesRouter from "./feature/file/FilesRouter.js";
import path from "node:path";
import fileUpload from "express-fileupload";
import {fileURLToPath} from "url";
import UserRouter from "./feature/user/UserRouter.js";
import corsMiddleware from "./core/middleware/corsMiddleware.js";
import config from "./core/config.js";

const app = express();

app.use(fileUpload({}))
app.use(express.json());

if(process.env.NODE_ENV === 'DEVELOPMENT'){
    app.use(corsMiddleware);
}
app.use('/avatar/', express.static(config.avatars_directory));
app.use('/api/',AuthenticationRouter)
app.use('/api/',FilesRouter)
app.use('/api/',UserRouter)

app.use(errorHandler);

export function getBaseDirectory(){
    return path.dirname(fileURLToPath(import.meta.url))
}

export default app;
