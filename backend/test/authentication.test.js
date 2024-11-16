import {MongoMemoryServer} from "mongodb-memory-server";
import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import mongoose from "mongoose";
import request from "supertest"
import app from "../app.js";
import UserModel from "../feature/user/UserModel.js";

describe('POST Check email existence', () => {
    let mongoServer;

    before(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
        console.log("connected");

        await UserModel.create({ email: "test@example.com" });
    });

    it('should return true for an existing email', async () => {
        const response = await request(app)
            .post('/api/check-email-existence')
            .send({ email: "test@example.com" });

        expect(response.status).to.equal(200);
        expect(response.body.found).to.be.true;
    });

    it('should return false for a non-existing email', async () => {
        const response = await request(app)
            .post('/api/check-email-existence')
            .send({ email: "nonexistent@example.com" });

        expect(response.status).to.equal(200);
        expect(response.body.found).to.be.false;
    });

    it('should return 400 for an invalid email format', async () => {
        const response = await request(app)
            .post('/api/check-email-existence')
            .send({ email: "invalid-email" });

        expect(response.status).to.equal(400);
    });

    it('should return 400 for missing email', async () => {
        const response = await request(app)
            .post('/api/check-email-existence')
            .send({});

        expect(response.status).to.equal(400);
    });

    it('should handle case-insensitive email check', async () => {
        const response = await request(app)
            .post('/api/check-email-existence')
            .send({ email: "TEST@EXAMPLE.COM" });

        expect(response.status).to.equal(200);
        expect(response.body.found).to.be.true;
    });

    it('should return 500 if the database is unreachable', async () => {
        await mongoose.disconnect();

        const response = await request(app)
            .post('/api/check-email-existence')
            .send({ email: "test@example.com" });

        expect(response.status).to.equal(500);

        // Reconnect the database
        await mongoose.connect(mongoServer.getUri());
    });
});