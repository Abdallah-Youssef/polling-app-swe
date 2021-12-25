const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const assert = require('assert')

chai.use(chaiHttp);

describe('Authentication', () => {

    describe('POST signup', () => {
        it('Create account', (done) => {
            chai.request(app)
                .post('/userAuth/signup')
                .set('content-type', 'application/json')
                .send(JSON.stringify({
                    email: "adel@shakal.com",
                    password: "Password@1"
                }))
                .end((err, res) => {
                    // Expect a token and user id
                    console.log(res.body)
                    assert(res.body.token)
                    assert(res.body.user.id)
                    done();
                });
        });
    });

});