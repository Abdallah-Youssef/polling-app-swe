const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth_routes');
const userRouter = require('./routes/users_routes');
const postRouter = require('./routes/polls_routes');
const voteRouter = require('./routes/vote_routes');
const mongoose = require('mongoose');
const passport = require('passport');
mongoose.connect('mongodb+srv://ahmed:meow@cluster0.zz2aw.mongodb.net/MeowAPP?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}, err=>{
    if(err) {
        console.error(err);
        throw new Error("Error Connecting to Database");
    }
    console.log('Connected to DB');
})

const app = express();
app.use(express.json());
app.use(cookieParser());
//app.use(bodyParser.urlencoded({extended: false}));

app.use(cors({
    origin: true,
    credentials: true
}));


const DEBUG_FUNC = (req, res, next) => {
    console.log(req.headers);
    next();
}

app.use('/userAuth', authRouter);

app.use('/user', passport.authenticate('jwt', {session: false}), userRouter);

app.use('/post', DEBUG_FUNC, passport.authenticate('jwt', {session: false}), postRouter);

app.use('/vote', passport.authenticate('jwt', {session: false}), voteRouter);

app.get('/', (req, res)=>{
    console.log('GDGDF');
    res.status(200).json({hello: 'world'});
});

app.listen(5000, ()=>{
    console.log('Hemlo to meow app!');
})