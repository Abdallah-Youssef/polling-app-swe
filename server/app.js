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
  console.log(req.headers);
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
 * Home page, all polls, no need for authentication
 * Not scalable, of course.. is it?
 */
app.get('/', async (req, res)=>{
    const polls = await Poll.find({public: true})
    .populate('postedBy',
     {_id:0, display_name: 1});
    //console.log(`MAIN ENDPOINT ${polls}`);
    res.status(200).json({polls: polls.reverse()});
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
    await poll.populate('postedBy', {_id: 0, display_name: 1}).execPopulate();
    res.send(poll);
});

app.listen(5000, () => {
  console.log("Hemlo to meow app!");
});

module.exports = app