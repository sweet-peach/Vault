import {before, describe, it} from "mocha";
import request from "supertest";
import {expect} from "chai";
import baseConfigurationWrapper from "./helpers/baseConfigurationWrapper.js";
import AuthenticationService from "../feature/authentication/AuthenticationService.js";
import app from "../app.js";


describe('POST /files/mkdir', baseConfigurationWrapper(() => {
    let validToken;
    before(async () => {
        const {token} = await AuthenticationService.register("testuser@example.com", "password123");
        validToken = token.token;
    });

    it('should create a directory', async () => {
        const response = await request(app)
            .post('/api/files/mkdir')
            .set('cookie', [`token=${validToken};`])
            .send({name: 'New Directory', parentDirectoryId: null});

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('id');
        expect(response.body.name).to.equal('New Directory');
    });

    it('should return 400 for missing name', async () => {
        const response = await request(app)
            .post('/api/files/mkdir')
            .set('cookie', [`token=${validToken};`])
            .send({parentDirectoryId: null});

        expect(response.status).to.equal(400);
    });
}));

describe('GET /files', baseConfigurationWrapper(() => {
    let validToken;
    before(async () => {
        const {token} = await AuthenticationService.register("testuser@example.com", "password123");
        validToken = token.token;
    });

    it('should list files in the directory', async () => {
        const response = await request(app)
            .get('/api/files')
            .set('cookie', [`token=${validToken};`]);

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });
}));

describe('DELETE /file', baseConfigurationWrapper(() => {
    let validToken;
    let fileId;
    before(async () => {
        const {token} = await AuthenticationService.register("testuser@example.com", "password123");
        validToken = token.token;

        const createdFileResponse = await request(app)
            .post('/api/files/upload')
            .set('cookie', [`token=${validToken};`])
            .attach('file', './test/assets/sample-file.txt');
        fileId = createdFileResponse.body[0].id;
    });

    it('should delete a file', async () => {
        const response = await request(app)
            .delete('/api/file')
            .set('cookie', [`token=${validToken};`])
            .send({fileId});

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('ok');
    });

    it('should return 400 for missing fileId', async () => {
        const response = await request(app)
            .delete('/api/file')
            .set('cookie', [`token=${validToken};`]);

        expect(response.status).to.equal(400);
    });
}));

describe('POST /files/upload', baseConfigurationWrapper(() => {
    let validToken;
    before(async () => {
        const {token} = await AuthenticationService.register("testuser@example.com", "password123");
        validToken = token.token;
    });

    it('should upload a file', async () => {
        const response = await request(app)
            .post('/api/files/upload')
            .set('cookie', [`token=${validToken};`])
            .attach('file', './test/assets/sample-file.txt');

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });

    it('should return 400 for missing file', async () => {
        const response = await request(app)
            .post('/api/files/upload')
            .set('cookie', [`token=${validToken};`]);

        expect(response.status).to.equal(400);
    });
}));

describe('GET /files/download', baseConfigurationWrapper(() => {
    let validToken;
    let fileId;
    before(async () => {
        const {token} = await AuthenticationService.register("testuser@example.com", "password123");
        validToken = token.token;

        const createdFileResponse = await request(app)
            .post('/api/files/upload')
            .set('cookie', [`token=${validToken};`])
            .attach('file', './test/assets/sample-file.txt');
        fileId = createdFileResponse.body[0].id;
    });

    it('should download a file', async () => {
        const response = await request(app)
            .get('/api/files/download')
            .set('cookie', [`token=${validToken};`])
            .query({fileId});

        expect(response.status).to.equal(200);
        expect(response.headers['content-disposition']).to.include('attachment');
    });

    it('should return 400 for missing fileId', async () => {
        const response = await request(app)
            .get('/api/files/download')
            .set('cookie', [`token=${validToken};`]);

        expect(response.status).to.equal(400);
    });
}));

describe('GET /files/search', baseConfigurationWrapper(() => {
    let validToken;
    before(async () => {
        const {token} = await AuthenticationService.register("testuser@example.com", "password123");
        validToken = token.token;
    });

    it('should search for files by name', async () => {
        const response = await request(app)
            .get('/api/files/search')
            .set('cookie', [`token=${validToken};`])
            .query({fileName: 'sample'});

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });

    it('should return 400 for missing fileName', async () => {
        const response = await request(app)
            .get('/api/files/search')
            .set('cookie', [`token=${validToken};`]);

        expect(response.status).to.equal(400);
    });
}));

