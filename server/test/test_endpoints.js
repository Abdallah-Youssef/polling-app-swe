const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const assert = require('assert')
const User = require('../models/user_schema')
const bcrypt = require('bcryptjs');

chai.use(chaiHttp);

describe('Authentication', () => {
    const adel = {
        email: "adel@shakal.com",
        password: "Password@1"
    }

    let token;

    it('Create account', (done) => {

        chai.request(app)
            .post('/userAuth/signup')
            .set('content-type', 'application/json')
            .send(JSON.stringify(adel))
            .end(async (err, res) => {
                // Expect a token and user id
                assert(res.body.token)
                token = res.body.token; //save token for later tests
                assert(res.body.user.id)

                const user = await User.findOne({
                    _id: res.body.user.id
                });

                assert(user.local.email === adel.email)
                assert(await bcrypt.compare(adel.password, user.local.password))
                done();
            });
    });

    
    /*it('Create Poll', (done)=>{
        /*chai.request(app)
            .post('/polls/createPoll')
            .set('content-type', 'application/json')
            .send(JSON.stringify(adel))
            .end(async (err, res) => {
                // Expect a token and user id
                assert(res.body.token)
                token = res.body.token; //save token for later tests
                assert(res.body.user.id)

                const user = await User.findOne({
                    _id: res.body.user.id
                });

                assert(user.local.email === adel.email)
                assert(await bcrypt.compare(adel.password, user.local.password))
                done();
            }); dude what a waste of time
    });*/

});

describe( 'Authorization', () =>{
    // const dummy_user = 
});