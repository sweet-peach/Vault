import {Router} from "express";
import validateRequest from "../../core/middleware/validateRequest.js";
import Joi from "joi";
import asyncWrapper from "../../core/middleware/asyncWrapper.js";
import AuthenticationService from "./AuthenticationService.js";

const router = new Router();

router.post('/login', validateRequest(
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

router.post('/register', validateRequest(
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




export default router;