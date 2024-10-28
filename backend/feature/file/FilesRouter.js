import {Router} from "express";
import authorizationMiddleware from "../../core/middleware/authorizationMiddleware.js";
import asyncWrapper from "../../core/middleware/asyncWrapper.js";
import validateRequest from "../../core/middleware/validateRequest.js";
import FileService from "./FileService.js";
import Joi from "joi";

const FilesRouter = new Router();

FilesRouter.post('/file/mkdir',
    authorizationMiddleware,
    validateRequest({
        name: Joi.string().required(),
        parentDirectoryId: Joi.string()
    }),
    asyncWrapper(async (req, res) => {
        const {name, parentDirectoryId} = req.parsedData;
        const user = req.user;

        const newDirectory = await FileService.createDirectory(name, user.id, parentDirectoryId);
        res.json(newDirectory);
    })
);
FilesRouter.get('/files',
    authorizationMiddleware,
    validateRequest({
        directoryId: Joi.string(),
        sort: Joi.string()
    }),
    asyncWrapper(async (req, res) => {
        const {directoryId, sort} = req.parsedData;
        const user = req.user;

        const files = await FileService.listDirectory(directoryId, user.id);
        res.json(files);
    })
)


export default FilesRouter;