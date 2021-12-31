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


app.use('/vote', passport.authenticate('jwt', { session: false }), voteRouter);

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
  console.log(req.query);
  if (req.query.searchBy !== 'title' && req.query.searchBy !== 'author') {
    res.status(400).send("searchBy not allowed")
    return
  }

  const pageNumber = req.query.pageNumber ?? 1

  if (req.query.searchBy === 'title') {
    const polls = await Poll.find({
      public: true,
      question: { $regex: req.query.searchAttribute ?? '', $options: 'i' }
    })
      .populate('postedBy', { _id: 1, display_name: 1, 'local.email': 1 })
      .skip((pageNumber - 1) * 10)
      .limit(10)

    res.status(200).json({
      polls: polls,
      count: polls.length
    });

    return
  }

  if (req.query.searchBy === 'author') {
    // email
    const users = await User.find({
      'local.email': { $regex: req.query.searchAttribute ?? '', $options: 'i' }
    })

    console.log(users)

    let polls = []
    for(let index =0;index<users.length;index++){
      let userPolls = await Poll.find({ public: true, postedBy: users[index]._id })
      .populate('postedBy', { _id: 1, display_name: 1, 'local.email': 1 })
      .skip((pageNumber - 1) * 10)
      .limit(10)
      polls.push(...userPolls);
    }
    res.status(200).json({
      polls,
      count: polls.length
    });

    return

  }

  res.status(500).send("Adel?")

});


/**
 * The sharing ID
 */
app.get('/shared_poll/:pollId', async (req, res) => {
  const poll = await Poll.findById(req.params.pollId);
  await poll.populate('postedBy', { _id: 0, display_name: 1 }).execPopulate();
  res.send(poll);
});

app.listen(5000, () => {
  console.log("Hemlo to meow app!");
});

module.exports = app