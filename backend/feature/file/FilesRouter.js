import {Router} from "express";
import authorizationMiddleware from "../../core/middleware/authorizationMiddleware.js";
import asyncWrapper from "../../core/middleware/asyncWrapper.js";
import validateRequest from "../../core/middleware/validateRequest.js";
import FileService from "./FileService.js";
import Joi from "joi";
import NoFileProvided from "./errors/NoFileProvided.js";
import FileNotFoundError from "./errors/FileNotFoundError.js";

const FilesRouter = new Router();

FilesRouter.post('/files/mkdir',
    authorizationMiddleware,
    validateRequest({
        name: Joi.string().required(),
        parentDirectoryId: Joi.any()
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

FilesRouter.delete('/file',
    authorizationMiddleware,
    validateRequest({
        fileId: Joi.string().required(),
    }),
    asyncWrapper(async (req, res) => {
        const {fileId} = req.parsedData;
        const user = req.user;

        const files = await FileService.deleteFile(fileId,user.id);
        res.json({message: "ok"});
    })
)

FilesRouter.post('/files/upload',
    authorizationMiddleware,
    validateRequest({
        directoryId: Joi.string()
    }),
    asyncWrapper(async (req, res) => {
        const {directoryId, file} = req.parsedData;
        const user = req.user;

        const files = req?.files?.file;
        if (!files) {
            throw new NoFileProvided("No file provided");
        }

        const uploadedFiles = [];
        if (Array.isArray(files)) {
            for (const file of files) {
                const createdFile = await FileService.uploadFile(file, user.id, directoryId);
                uploadedFiles.push(createdFile);
            }
        } else {
            const createdFile = await FileService.uploadFile(files, user.id, directoryId);
            uploadedFiles.push(createdFile);
        }
        return res.json(uploadedFiles);
    })
)

FilesRouter.get('/files/download',
    authorizationMiddleware,
    validateRequest({
        fileId: Joi.string().required()
    }),
    asyncWrapper(async (req, res)=>{
        const {fileId} = req.parsedData;
        const user = req.user;
        const file = await FileService.getFile(fileId, user.id, false);
        const path = FileService.getFilePath(file);
        return res.download(path, file.name);
    })
)

FilesRouter.get('/files/search',
    authorizationMiddleware,
    validateRequest({
        fileName: Joi.string().required()
    }),
    asyncWrapper(async (req, res)=>{
        const {fileName} = req.parsedData;
        const user = req.user;
        const files = await FileService.getFilesByName(fileName, user.id);
        return res.json(files);
    })
)


export default FilesRouter;