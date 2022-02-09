const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const assert = require('assert')
const User = require('../models/user_schema')
const Poll = require('../models/poll_schema')

const bcrypt = require('bcryptjs');
chai.use(chaiHttp);
const adel = {
    email: "adel@shakal.com",
    password: "Password@1"
}

const adelUserInfo = {
    bio: "I am adel",
    display_name: "Adel",
    color: "#fff"
}

const mohamed = {
    email: "mohamed@salah.com",
    password: "Password@1"
}

describe('Authentication', () => {


    it('Create account', (done) => {

        // Create adel
        chai.request(app)
            .post('/userAuth/signup')
            .set('content-type', 'application/json')
            .send(JSON.stringify(adel))
            .end(async (err, res) => {
                // Expect a token and user id
                assert(res.body.token)
                assert(res.body.user.id)

                const user = await User.findOne({
                    _id: res.body.user.id
                });


                assert(user.local.email === adel.email)
                assert(await bcrypt.compare(adel.password, user.local.password))
                
                adel.id = user._id
                adel.token = res.body.token

                done();
            });

        // Create mohamed
        chai.request(app)
            .post('/userAuth/signup')
            .set('content-type', 'application/json')
            .send(JSON.stringify(mohamed))
            .end(async (err, res) => {
                mohamed.id = res.body.user.id
                mohamed.token = res.body.token
            });
    });


    it('Sign in using local method', (done) => {
        chai.request(app)
        .post('/userAuth/login')
        .set('content-type', 'application/json')
        .send(JSON.stringify({
            email: adel.email,
            password: adel.password
        }))
        .end(async (err, res) => {
            // Expect a token and user id
            assert(res.body.token)
            assert(res.body.user.id)

            adel.token = res.body.token

            done();
        });
    })

});

describe('Queries on Polls', () => {

    before(async () => {
        // Create some test polls 21 total
        // first 2 private, last 19 are public
        // first 15 by adel, remaining by mohamed

        for (let i = 0; i < 21; i++) {
            const pollData = {
                postedBy: i < 15 ? adel.id : mohamed.id,
                createdOn: new Date().getTime(),
                question: i < 10 ? "Less" : "Greater",
                public: i >= 2,
                choices: ["Choice 1", "Choice 2"]
            };

            const newPost = new Poll(pollData);
            await newPost.save();
        }

    })

    it("Handles invalid searchBy types", (done) => {
        chai.request(app)
            .get('/pollFeed?searchBy=hamada')
            .end(async (err, res) => {
                assert(res.status === 400)
                assert(res.body.error)
                done()
            });
    })

    it("Handles invalid pageNumber", (done) => {
        chai.request(app)
            .get('/pollFeed?pageNumber=-1')
            .end(async (err, res) => {
                assert(res.status === 400)
                assert(res.body.error)
                done()
            });
    })

    it("Behaves normally for empty query", (done) => {
        chai.request(app)
            .get('/pollFeed')
            .end(async (err, res) => {
                assert(res.status === 200)
                assert(res.body.polls.length === 10)

                // only 19 polls are public
                assert(res.body.count === 19)
                done()
            });
    })

    describe("pageNumber", () => {
        it("Behaves normally for pageNumber query", (done) => {
            chai.request(app)
                .get('/pollFeed?pageNumber=2')
                .end(async (err, res) => {
                    assert(res.status === 200)
                    assert(res.body.polls.length === 9)
                    assert(res.body.count === 19)
                    done()
                });
        })

        it("Handles out of range pageNumber", (done) => {
            chai.request(app)
                .get('/pollFeed?pageNumber=3')
                .end(async (err, res) => {
                    assert(res.status === 200)
                    assert(res.body.polls.length === 0)
                    assert(res.body.count === 19)
                    done()
                });
        })

    })

    describe('searchBy author', () => {
        it("Handles searchBy Author mohamed correctly", (done) => {
            chai.request(app)
                .get('/pollFeed?searchBy=author&searchAttribute=mohamed')
                .end(async (err, res) => {
                    assert(res.status === 200)
                    assert(res.body.polls.length === 6)
                    assert(res.body.count === 6)
                    done()
                });
        })
        it("Handles searchBy Author adel correctly", (done) => {
            chai.request(app)
                .get('/pollFeed?searchBy=author&searchAttribute=adel')
                .end(async (err, res) => {
                    assert(res.status === 200)

                    assert(res.body.polls.length === 10)

                    // adel has 13 public polls
                    assert(res.body.count === 13)
                    done()
                });
        })

        it("Handles pagination Author adel correctly", (done) => {
            chai.request(app)
                .get('/pollFeed?pageNumber=2&searchBy=author&searchAttribute=adel')
                .end(async (err, res) => {
                    assert(res.status === 200)

                    assert(res.body.polls.length === 3)

                    // adel has 13 public polls
                    assert(res.body.count === 13)
                    done()
                });
        })

    })




    describe("searchBy title", (done) => {

        it("'Less' polls", (done) => {
            chai.request(app)
                .get('/pollFeed?searchBy=title&searchAttribute=less')
                .end(async (err, res) => {
                    assert(res.status === 200)


                    // The first ten polls have title "Less", the first two are public
                    assert(res.body.polls.length === 8)
                    assert(res.body.count === 8)
                    done()
                });
        })

        it("'Greater' polls", (done) => {
            chai.request(app)
                .get('/pollFeed?searchBy=title&searchAttribute=greater')
                .end(async (err, res) => {
                    assert(res.status === 200)
                    assert(res.body.polls.length === 10)
                    assert(res.body.count === 11)
                    done()
                });
        })

        it("'Greater' polls pagination", (done) => {
            chai.request(app)
                .get('/pollFeed?pageNumber=2&searchBy=title&searchAttribute=greater')
                .end(async (err, res) => {
                    assert(res.status === 200)
                    assert(res.body.polls.length === 1)
                    assert(res.body.count === 11)
                    done()
                });
        })
    })

})


describe('Queries on Users', () => {
    describe('Update user info', () => {
        it ('Ignores unallowed attributes, and updates correct attributes', (done) => {
            chai.request(app)
            .post('/user/updateinfo')
            .set('content-type', 'application/json')
            .set('Authorization', adel.token)
            .send(JSON.stringify({
                ...adelUserInfo,
                badAttribute: "badValue"
            }))
            .end(async (err, res) => {
                const adelUser = await User.findById(adel.id)

                assert(!res.body.badAttribute)
                assert(!adelUser.badAttribute)

                assert(res.body.bio === adelUserInfo.bio)
                assert(adelUser.bio === adelUserInfo.bio)
                done();
            });
        })

        it ('Rejects invalid color strings', (done) => {
            chai.request(app)
            .post('/user/updateinfo')
            .set('content-type', 'application/json')
            .set('Authorization', adel.token)
            .send(JSON.stringify({
                color: "not rgb hex"
            }))
            .end((err, res) => {
                assert(res.body.error)
                done();
            });
        })

        it ('Rejects non numeric age', (done) => {
            chai.request(app)
            .post('/user/updateinfo')
            .set('content-type', 'application/json')
            .set('Authorization', adel.token)
            .send(JSON.stringify({
                age: "string not number"
            }))
            .end((err, res) => {
                assert(res.body.error)
                done();
            });
        })

        it ('Rejects wrong gender', (done) => {
            chai.request(app)
            .post('/user/updateinfo')
            .set('content-type', 'application/json')
            .set('Authorization', adel.token)
            .send(JSON.stringify({
                gender: "not a gender"
            }))
            .end((err, res) => {
                assert(res.body.error)
                done();
            });
        })
    })

    describe('Query user info', () => {

        it ('Handles non existing users', (done) => {
            chai.request(app)
            .get('/user/123')
            .set('content-type', 'application/json')
            .set('Authorization', adel.token)
            .end((err, res) => {
                assert(res.body.error)
                done();
            });
        })


        it ('Gets Correct Info', (done) => {
            chai.request(app)
            .get('/user/'+adel.id)
            .set('content-type', 'application/json')
            .set('Authorization', adel.token)
            .end((err, res) => {
                assert(res.body.bio === adelUserInfo.bio)
                assert(res.body.display_name === adelUserInfo.display_name)
                assert(res.body.color === adelUserInfo.color)

                done();
            });
        })
    })
})

describe('Closing Poll', () => {
    let pollId

    before(async () => {
        // Adel posts a poll
        const pollData = {
            postedBy: adel.id ,
            createdOn: new Date().getTime(),
            question: "Poll Question",
            public: true,
            choices: ["Choice 1", "Choice 2"]
        };

        const newPost = new Poll(pollData);
        await newPost.save();
        pollId = newPost._id
    })

    it('Prevents non author from closing', (done) => {
        chai.request(app)
            .get('/polls/'+pollId+"/close")
            .set('content-type', 'application/json')
            .set('Authorization', mohamed.token) // Mohamed tries to close adel's poll
            .end(async (err, res) => {
                assert(res.body.error)
                done();
            });
    })

    it('Closes correctly', (done) => {
        chai.request(app)
            .get('/polls/'+pollId+"/close")
            .set('content-type', 'application/json')
            .set('Authorization', adel.token) // Adel tries to close his poll
            .end(async (err, res) => {
                assert(res.text === "poll closed")

                const poll = await Poll.findById(pollId)
                assert(poll.closed)
                done();
            });
    })

    it('Handles Redundant close', (done) => {
        chai.request(app)
            .get('/polls/'+pollId+"/close")
            .set('content-type', 'application/json')
            .set('Authorization', adel.token) 
            .end(async (err, res) => {
                assert(res.text === "poll closed")

                const poll = await Poll.findById(pollId)
                assert(poll.closed)
                done();
            });
    })

    it('Rejects Submit after closing', (done) => {
        chai.request(app)
            .post('/votes/submit')
            .set('content-type', 'application/json')
            .set('Authorization', adel.token) 
            .send({
                poll: pollId,
                choice: 0
            })
            .end(async (err, res) => {
                assert(res.body.error === "poll closed")

                const poll = await Poll.findById(pollId)
                // Make sure no votes are recorded
                const {choices} = await poll.getResultSummary()
                assert(choices[0].count === 0)
                assert(choices[1].count === 0)
                done();
            });
    })

    it('Rejects Changing vote after closing', (done) => {
        chai.request(app)
            .post('/votes/change')
            .set('content-type', 'application/json')
            .set('Authorization', adel.token) 
            .send({
                poll: pollId,
                choice: 0
            })
            .end(async (err, res) => {
                assert(res.body.error === "poll closed")
                
                const poll = await Poll.findById(pollId)
                // Make sure no votes are recorded
                const {choices} = await poll.getResultSummary()
                assert(choices[0].count === 0)
                assert(choices[1].count === 0)
                done();
            });
    })

})
