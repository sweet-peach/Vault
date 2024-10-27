import {Router} from "express";
import validateRequest from "../../core/middleware/validateRequest.js";
import Joi from "joi";
import asyncWrapper from "../../core/middleware/asyncWrapper.js";
import AuthenticationService from "./AuthenticationService.js";

const router = new Router();

router.post('/api/login', validateRequest(
        {
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }),
    asyncWrapper(async (req, res) => {
        const {email, password} = req.parsedData;
        const response = await AuthenticationService.login(email, password);

        return res.json(response)
    })
)

router.post('/api/register', validateRequest(
        {
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }),
    asyncWrapper(async (req, res) => {
        const {email, password} = req.parsedData;
        const response = await AuthenticationService.register(email, password);

        return res.json(response);
    })
)

router.post('/api/me',
    asyncWrapper(async (req, res) => {
        const token = req.headers.authorization.split(' ')[1]
        const response = await AuthenticationService.checkToken(token);

        return res.json(response);
    })
)


export default router;