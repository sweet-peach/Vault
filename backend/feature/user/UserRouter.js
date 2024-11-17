import {Router} from "express";
import authorizationMiddleware from "../../core/middleware/authorizationMiddleware.js";
import asyncWrapper from "../../core/middleware/asyncWrapper.js";
import BadAvatarError from "./errors/BadAvatarError.js";
import UserService from "./UserService.js";
import validateRequest from "../../core/middleware/validateRequest.js";
import Joi from "joi";


const UserRouter = new Router();

UserRouter.get('/me',
    authorizationMiddleware,
    asyncWrapper(async (req, res) => {
        const user = req.user;

        return res.json(await UserService.getUserById(user.id));
    })
)

UserRouter.post(
    "/me/password",
    authorizationMiddleware,
    validateRequest({
        oldPassword: Joi.string().min(1).required(),
        newPassword: Joi.string().min(1).required()
    }),
    asyncWrapper(async (req, res) => {
        const {oldPassword, newPassword} = req.parsedData;
        const user = req.user;
        await UserService.changePassword(user.id,oldPassword, newPassword);
        res.json({message: "password changed"});
    })
)

UserRouter.post(
    "/me/avatar/upload",
    authorizationMiddleware,
    asyncWrapper(async (req, res) => {
        if(!req.files){
            throw new BadAvatarError("Avatar not provided")
        }
        const newAvatar = req.files?.file;
        if(Array.isArray(newAvatar)){
            throw new BadAvatarError("Trying to upload multiple avatars")
        }

        const user = req.user;
        const avatarName = await UserService.uploadAvatar(newAvatar,user.id);
        res.json({avatarName: avatarName});
    })
)

UserRouter.delete(
    "/me/avatar",
    authorizationMiddleware,
    asyncWrapper(async (req, res) => {
        await UserService.deleteAvatar(req.user.id);
        res.json({message: "Avatar deleted"});
    })
)


export default UserRouter;