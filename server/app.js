const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth_routes");
const userRouter = require("./routes/users_routes");
const pollRouter = require("./routes/poll_routes");
const voteRouter = require("./routes/vote_routes");
const passport = require("passport");
const mongoose = require("mongoose");
const Poll = require('./models/poll_schema');
const Vote = require('./models/vote_schema');
const User = require('./models/user_schema');

const config = require('config')

mongoose.set('useFindAndModify', false);
mongoose.connect(
    config.get('DBHost'),
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: config.get('DBuserName'),
        pass: config.get('DBpass')
    },
    (err) => {
        if (err) {
            console.error(err);
            throw new Error("Error Connecting to Database");
        }
        console.log("Connected to DB " + config.get('DBHost'))
    }
);

const app = express();
app.use(express.json());
app.use(cookieParser());
//app.use(bodyParser.urlencoded({extended: false}));

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

const DEBUG_FUNC = (req, res, next) => {
    //console.log(req.headers);
    next();
};

app.use("/userAuth", authRouter);

app.use("/user", passport.authenticate("jwt", { session: false }), userRouter);

app.use(
    "/polls",
    DEBUG_FUNC,
    passport.authenticate("jwt", { session: false }),
    pollRouter
);


app.use('/votes', passport.authenticate('jwt', {session: false}), voteRouter);

/**
 * @api {get} / Query all public polls
 * @apiName QeuryPolls
 * @apiGroup Polls
 *
 * @apiQuery {number} [pageNumber=1] Page number
 * @apiQuery {string="title","author"} [searchBy] Type of search. if author, search by email
 * @apiQuery {String} [searchAttribute] the attribute to filterpolls with
 * @apiParamExample Request-Example:
 * /?pageNumber=2&searchBy=author&searchAtrribute=hamada
 * 
 * @apiSuccess {Poll[]} polls 10 polls matching query and page number
 * @apiSuccess {number} count Number of polls that match the query
 * 
 */
app.get('/', async (req, res) => {
    if (req.query.searchBy && req.query.searchBy !== 'title' && req.query.searchBy !== 'author') {
        res.status(400).send({ error: "searchBy type not allowed" })
        return
    }

    if (req.query.pageNumber <= 0){
        res.status(400).send({ error: "Page Number must be positive" })
        return
    }



    const pageNumber = req.query.pageNumber ?? 1
    const searchAttribute = req.query.searchAttribute ?? ""

    if (req.query.searchBy === 'title') {
        const q = await Poll
            // EFfecient query pipeline to get the data with limit/skip and count before limit
            .aggregate([
                {
                    $match:{
                        public: true,
                        question: { $regex: searchAttribute, $options: 'i' }
                    }
                },

                {
                    $facet: {
                        "stage1": [{ "$group": { _id: null, count: { $sum: 1 } } }],
                        "stage2": [{ "$skip": (pageNumber - 1) * 10 }, { "$limit": 10 }]
                    }
                },
                { $unwind: "$stage1" },
                //output projection
                {
                    $project: {
                        count: "$stage1.count",
                        polls: "$stage2"
                    }
                }

            ]);

        const polls = q[0].polls
        const count = q[0].count

        await Poll.populate(polls, {path: "postedBy", select:{ _id: 1, display_name: 1, 'local.email': 1 } });


        res.status(200).json({
            polls,
            count
        });

        return
    }

    if (req.query.searchBy === 'author') {
        const users = await User.find({
            'local.email': { $regex: req.query.searchAttribute ?? '', $options: 'i' }
        })


        let polls = []
        for (let index = 0; index < users.length; index++) {
            let userPolls = await Poll.find({ public: true, postedBy: users[index]._id })
                .populate('postedBy', { _id: 1, display_name: 1, 'local.email': 1 })

            polls.push(...userPolls);
        }

        const count = polls.length
        polls = polls.slice((pageNumber - 1) * 10, pageNumber * 10)

        res.status(200).json({
            polls,
            count
        });

        return
    }

   
    // No query, return all public polls
    const polls = await Poll.find({ public: true, })
        .populate('postedBy', { _id: 1, display_name: 1, 'local.email': 1 })
        .skip((pageNumber - 1) * 10)
        .limit(10)

    const countPublicPolls = await Poll.countDocuments({public: true})

    res.status(200).json({
        polls,
        count: countPublicPolls
    });
    return
});


/**
 * View the details of a particular poll
 * response format:
 * {
 *      postedBy: {display_name : (string)}
 *      createdOn: Date
 *      question: string
 *      public: boolean
 *      choices: string[] 
 * }
 */
app.get('/poll/:pollId', async (req, res) =>{
    const poll = await Poll.findById(req.params.pollId);
    await poll.populate('postedBy', { _id: 0, display_name: 1 }).execPopulate();
    res.send(poll);
});

app.listen(5000, () => {
    console.log("Hemlo to meow app!");
});

module.exports = app