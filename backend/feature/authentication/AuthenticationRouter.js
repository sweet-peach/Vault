import {Router} from "express";
import validateRequest from "../../core/middleware/validateRequest.js";
import Joi from "joi";
import asyncWrapper from "../../core/middleware/asyncWrapper.js";
import AuthenticationService from "./AuthenticationService.js";
import UserModel from "../user/UserModel.js";

const router = new Router();


router.post('/check-email-existence', validateRequest(
        {
            email: Joi.string().email().required(),
        }),
    asyncWrapper(async (req, res) => {
        const {email} = req.parsedData;

        const candidate = await UserModel.findOne({email: email}).exec();

        if (candidate) {
            return res.json({found: true})
        } else {
            return res.json({found: false})
        }
    })
)

router.post('/login', validateRequest(
        {
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }),
    asyncWrapper(async (req, res) => {
        const {email, password} = req.parsedData;
        const response = await AuthenticationService.login(email, password);
        const {token, expiresAt} = response.token;

        return res.cookie('token', token, {
            expires: expiresAt,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        }).json(response);
    })
)


router.post('/register', validateRequest(
        {
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }),
    asyncWrapper(async (req, res) => {
        const {email, password} = req.parsedData;
        const response = await AuthenticationService.register(email, password);
        const {token, expiresAt} = response.token;

        return res.cookie('token', token, {
            expires: expiresAt,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        }).json(response);
    })
)


export default router;