import chai = require('chai');
const request = require('supertest');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const createServer = require("../../server/index");
const app = createServer.default();
const {expect} =  require('chai');


describe('', function () {
    it('should responde with 200', function (done) {
        request(app).get('/').expect(200, done)
    });

    it('/login respond with 200', function (done) {
        request(app).get('/login').expect(404, done);
    });
})

describe('POST /register', function () {
    it('should responde with 201', function (done) {
        const user = {
            firtname: "JOHN",
            lastname: "Doe",
            email: "jod.dosces@dsfssd.fr",
            password: "testlegenss"
        };

        const {status}= request(app)
            .post('/register')
            .send(user)
            .end((err:any, response:any)=>{
                expect(response.status).to.equal(201)
                done()
            });
    });
    let token:string;

    it('should log in and return status 200', function (done) {
        const user = {
            email: "jod.dosces@dsfssd.fr",
            password: "testlegenss"
        };
         request(app)
            .post('/login')
            .send(user)
            .end((err: any, response: any) => {
                token = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
                expect(response.status).to.equal(200);
                done();
            });
    });
})