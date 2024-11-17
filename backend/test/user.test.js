import "dotenv/config"
import {before, describe, it} from "mocha";
import AuthenticationService from "../feature/authentication/AuthenticationService.js";
import request from "supertest";
import app from "../app.js";
import {expect} from "chai";
import baseConfigurationWrapper from "./helpers/baseConfigurationWrapper.js";
import fs from "node:fs";

describe('POST Change password', baseConfigurationWrapper(() => {
    let validToken;
    before(async () => {
        const {token} = await AuthenticationService.register("testuser@example.com", "password123");
        validToken = token.token;
    });

    it('should return 401 for invalid cookie token', async () => {
        const response = await request(app)
            .post('/api/me/password')
            .set('cookie', [`token=invalid;`])
            .send({oldPassword: "password123", newPassword: "password"});

        expect(response.status).to.equal(401);
    })

    it('should return 400 for invalid old password', async () => {
        const response = await request(app)
            .post('/api/me/password')
            .set('cookie', [`token=${validToken};`])
            .send({oldPassword: "wrongpassword", newPassword: "password"});

        expect(response.status).to.equal(400);
    })

    it('should return 400 for no old password field', async () => {
        const response = await request(app)
            .post('/api/me/password')
            .set('cookie', [`token=${validToken};`])
            .send({newPassword: "password"});

        expect(response.status).to.equal(400);
    })

    it('should return 400 for no new password field', async () => {
        const response = await request(app)
            .post('/api/me/password')
            .set('cookie', [`token=${validToken};`])
            .send({oldPassword: "password123"});

        expect(response.status).to.equal(400);
    })

    it('should return 400 for no body', async () => {
        const response = await request(app)
            .post('/api/me/password')
            .set('cookie', [`token=${validToken};`])

        expect(response.status).to.equal(400);
    })

    it('should return 200 for valid password change', async () => {
        const response = await request(app)
            .post('/api/me/password')
            .set('cookie', [`token=${validToken};`])
            .send({oldPassword: "password123", newPassword: "password"})

        expect(response.status).to.equal(200);
    })

    it('should return 400 for authenticating with old password', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({email: "testuser@example.com", newPassword: "password123"})

        expect(response.status).to.equal(400);
    })

    it('should return 200 for authenticating with new password', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({email: "testuser@example.com", password: "password"})

        expect(response.status).to.equal(200);
    })
}));

describe('GET Me', baseConfigurationWrapper( () => {
    let createdUser;
    let validToken;
    before(async () => {
        const {token, user} = await AuthenticationService.register("testuser@example.com", "password123");
        createdUser = user;
        validToken = token.token;
    });

    it('should return user information', async () => {
        const response = await request(app)
            .get('/api/me')
            .set('cookie', [`token=${validToken};`])

        expect(response.body).to.deep.equal({
            user: {
                id: createdUser.id,
                email: createdUser.email,
                diskSpace: createdUser.diskSpace,
                usedSpace: createdUser.usedSpace,
            }
        });
    })
}));

describe('POST Upload Avatar', baseConfigurationWrapper(() => {
    let validToken;
    before(async () => {
        const {token} = await AuthenticationService.register("testuser@example.com", "password123");
        validToken = token.token;
    });

    it('should return 200 for successful avatar upload', async () => {
        const response = await request(app)
            .post('/api/me/avatar/upload')
            .set('cookie', [`token=${validToken};`])
            .attach('file', fs.createReadStream('./test/assets/sample-avatar.png'));

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('avatarName');
    });

    it('should return 400 for uploading multiple avatars', async () => {
        const response = await request(app)
            .post('/api/me/avatar/upload')
            .set('cookie', [`token=${validToken};`])
            .attach('file', fs.createReadStream('./test/assets/sample-avatar.png'))
            .attach('file', fs.createReadStream('./test/assets/sample-avatar-2.png'));

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Trying to upload multiple avatars');
    });

    it('should return 401 for missing authorization token', async () => {
        const response = await request(app)
            .post('/api/me/avatar/upload')
            .attach('file', fs.createReadStream('./test/assets/sample-avatar.png'));

        expect(response.status).to.equal(401);
    });

    it('should return 400 for missing file', async () => {
        const response = await request(app)
            .post('/api/me/avatar/upload')
            .set('cookie', [`token=${validToken};`]);

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Avatar not provided');
    });
}));

describe('DELETE Avatar', baseConfigurationWrapper(() => {
    let validToken;
    before(async () => {
        const {token, user} = await AuthenticationService.register("testuser@example.com", "password123");
        validToken = token.token;

        await request(app)
            .post('/api/me/avatar/upload')
            .set('cookie', [`token=${validToken};`])
            .attach('file', './test/assets/sample-avatar.png');
    });

    it('should return 200 for successful avatar deletion', async () => {
        const response = await request(app)
            .delete('/api/me/avatar')
            .set('cookie', [`token=${validToken};`]);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message', 'Avatar deleted');
    });

    it('should return 401 for missing authorization token', async () => {
        const response = await request(app)
            .delete('/api/me/avatar');

        expect(response.status).to.equal(401);
    });

    it('should handle deleting an avatar that does not exist (optional)', async () => {
        const response = await request(app)
            .delete('/api/me/avatar')
            .set('cookie', [`token=${validToken};`]);

        expect(response.status).to.equal(200);
    });
}));