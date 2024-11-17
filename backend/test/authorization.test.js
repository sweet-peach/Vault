import "dotenv/config"
import {before, describe, it} from "mocha";
import app from "../app.js";
import authorizationMiddleware from "../core/middleware/authorizationMiddleware.js";
import jwt from "jsonwebtoken";
import config from "../core/config.js";
import request from "supertest";
import {expect} from "chai";
import asyncWrapper from "../core/middleware/asyncWrapper.js";
import baseConfigurationWrapper from "./helpers/baseConfigurationWrapper.js";


describe('Check of authorization middleware', baseConfigurationWrapper( () => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_EXPIRATION = config.jwt_expiration_in_ms | 7 * 24 * 60 * 60 * 1000;
    let validToken;
    let inValidToken;
    before(async () => {
        validToken = jwt.sign({id: 1},JWT_SECRET,{expiresIn: JWT_EXPIRATION});
        inValidToken = jwt.sign({id: 1},"fake secret",{expiresIn: "1h"});
        app.post('/protected-route',authorizationMiddleware,asyncWrapper(async (req,res)=>{
            return res.json("ok");
        }))
    });
    it('should return 200 for valid token in cookies', async () => {
        const response = await request(app)
            .post('/protected-route')
            .set('cookie', [`token=${validToken};`])

        expect(response.status).to.equal(200);
    });

    it('should return 200 for valid token in headers', async () => {
        const response = await request(app)
            .post('/protected-route')
            .set('authorization', `Bearer ${validToken}`)

        expect(response.status).to.equal(200);
    });

    it('should return 401 for invalid token in cookie', async () => {
        const response = await request(app)
            .post('/protected-route')
            .set('cookie', [`token=${inValidToken};`])

        expect(response.status).to.equal(401);
    });

    it('should return 400 for invalid token in headers', async () => {
        const response = await request(app)
            .post('/protected-route')
            .set('authorization', `Bearer ${inValidToken}`)

        expect(response.status).to.equal(401);
    });
}));