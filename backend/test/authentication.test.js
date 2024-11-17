import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import "dotenv/config";
import request from "supertest";
import app from "../app.js";
import UserModel from "../feature/user/UserModel.js";
import bcrypt from 'bcryptjs';
import baseConfigurationWrapper from "./helpers/baseConfigurationWrapper.js";

describe('POST Check email existence', baseConfigurationWrapper( () => {
    let mongoServer;

    before(async () => {
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
}));

describe('POST Login', baseConfigurationWrapper( () => {
    let mongoServer;
    let user;

    before(async () => {
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await UserModel.create({
            email: "testuser@example.com",
            password: hashedPassword
        });
    });

    it('should login successfully with correct email and password', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ email: "testuser@example.com", password: "password123" });

        expect(response.status).to.equal(200);
        expect(response.header['set-cookie']).to.be.an('array').that.is.not.empty;
        const cookie = response.header['set-cookie'][0];
        expect(cookie).to.include('token');
    });

    it('should return 401 for incorrect password', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ email: "testuser@example.com", password: "wrongpassword" });

        expect(response.status).to.equal(401);
    });

    it('should return 401 for non-existing email', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ email: "nonexistent@example.com", password: "password123" });

        expect(response.status).to.equal(401);
    });

    it('should return 400 for missing email', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ password: "password123" });

        expect(response.status).to.equal(400);
    });

    it('should return 400 for missing password', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ email: "testuser@example.com" });

        expect(response.status).to.equal(400);
    });

    it('should return 400 for invalid email format', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ email: "invalid-email", password: "password123" });

        expect(response.status).to.equal(400);
    });
}));

describe('POST Register', baseConfigurationWrapper( () => {
    it('should register successfully with valid email and password', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({ email: "newuser@example.com", password: "password123" });

        expect(response.status).to.equal(201);
    });

    it('should return 400 for missing email', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({ password: "password123" });

        expect(response.status).to.equal(400);
    });

    it('should return 400 for missing password', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({ email: "newuser@example.com" });

        expect(response.status).to.equal(400);
    });

    it('should return 400 for invalid email format', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({ email: "invalid-email", password: "password123" });

        expect(response.status).to.equal(400);
    });

    it('should return 409 for an existing email', async () => {
        await request(app)
            .post('/api/register')
            .send({ email: "existinguser@example.com", password: "password123" });

        const response = await request(app)
            .post('/api/register')
            .send({ email: "existinguser@example.com", password: "password123" });

        expect(response.status).to.equal(409);
    });
}));

