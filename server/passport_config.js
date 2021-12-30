const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const User = require("./models/user_schema");

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const existingUser = await User.findOne({ "local.email": email });
        if (existingUser) {
          const isPasswordMatch = await existingUser.validatePassword(password);
          if (isPasswordMatch) return done(null, existingUser);
          else return done(null, false, { message: "sharafanta7" });
        }

        done(null, false, { message: "User doesn't exist" })
      } catch (err) {
        done(err, false);
      }
    }
  )
);

passport.use(
  "facebook",
  new FacebookStrategy(
    {
      clientID: "1890056141213739",
      clientSecret: "64140c1d240c10c05fe245eed0b37e3a",
      profileFields: ["emails"],
      callbackURL: "http://localhost:3000/userAuth/oauth/facebook/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ "facebook.id": profile.id });
        if (existingUser) return done(null, existingUser);
        const newUser = new User({
          login_method: "facebook",
          facebook: {
            id: profile.id,
            email: profile.emails[0].value,
          },
        });
        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        return done(null, false);
      }
    }
  )
);

passport.use(
  "jwt",
  new JWTStrategy(
    {
      secretOrKey: "secret_gamEd_Awy",
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.user_id);
        if (user) return done(null, user);
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
