import "dotenv/config"
import {before, describe, it} from "mocha";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import AuthenticationService from "../feature/authentication/AuthenticationService.js";
import request from "supertest";
import app from "../app.js";
import {expect} from "chai";


describe('POST change password', () => {
    let mongoServer;
    let validToken;
    before(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
        const {token} = await AuthenticationService.register("testuser@example.com","password123");
        validToken = token.token;
    });

    after(async ()=>{
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should return 401 for invalid cookie token',async () => {
        const response = await request(app)
            .post('/api/me/password')
            .set('cookie',[`token=invalid;`])
            .send({ oldPassword: "password123", newPassword: "password" });

        expect(response.status).to.equal(401);
    })

    it('should return 400 for invalid old password',async () => {
        const response = await request(app)
            .post('/api/me/password')
            .set('cookie',[`token=${validToken};`])
            .send({ oldPassword: "wrongpassword", newPassword: "password" });

        expect(response.status).to.equal(400);
    })

    it('should return 400 for no old password field',async () => {
        const response = await request(app)
            .post('/api/me/password')
            .set('cookie',[`token=${validToken};`])
            .send({newPassword: "password" });

        expect(response.status).to.equal(400);
    })

    it('should return 400 for no new password field',async () => {
        const response = await request(app)
            .post('/api/me/password')
            .set('cookie',[`token=${validToken};`])
            .send({oldPassword: "password123" });

        expect(response.status).to.equal(400);
    })

    it('should return 400 for no body',async () => {
        const response = await request(app)
            .post('/api/me/password')
            .set('cookie',[`token=${validToken};`])

        expect(response.status).to.equal(400);
    })

    it('should return 200 for valid password change',async () => {
        const response = await request(app)
            .post('/api/me/password')
            .set('cookie',[`token=${validToken};`])
            .send({oldPassword: "password123",newPassword:"password"})

        expect(response.status).to.equal(200);
    })

    it('should return 400 for authenticating with old password',async () => {
        const response = await request(app)
            .post('/api/login')
            .send({email: "testuser@example.com",newPassword:"password123"})

        expect(response.status).to.equal(400);
    })

    it('should return 200 for authenticating with new password',async () => {
        const response = await request(app)
            .post('/api/login')
            .send({email: "testuser@example.com",password:"password"})

        expect(response.status).to.equal(200);
    })

})