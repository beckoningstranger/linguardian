import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "../../services/getEnv.js";
import Users from "../../models/users.schema.js";

export const authConfig = {
  GOOGLE_ID: env.GOOGLE_ID as string,
  GOOGLE_SECRET: env.GOOGLE_KEY as string,
  COOKIE_KEY_1: env.COOKIE_KEY_1 as string,
  COOKIE_KEY_2: env.COOKIE_KEY_2 as string,
};

const GOOGLE_AUTH_OPTIONS = {
  callbackURL: "/auth/google/redirect",
  clientID: authConfig.GOOGLE_ID,
  clientSecret: authConfig.GOOGLE_SECRET,
};

passport.use(
  new GoogleStrategy(
    GOOGLE_AUTH_OPTIONS,
    async (accessToken, refreshToken, profile, done) => {
      console.log("Found this Google profile:", profile.id);

      const user = await Users.findOne({ id: profile.id });

      if (!user) {
        const newUser = await Users.create({
          id: profile.id,
          username: profile.displayName,
          email: profile.emails?.[0].value,
        });
        if (newUser) done(null, newUser);
      } else {
        done(null, user);
      }
    }
  )
);

// Save the session to the cookie
passport.serializeUser((user, done) => {
  console.log("Serialized user", user);
  done(null, user.id);
});

// Read the session from the cookie
passport.deserializeUser(async (id, done) => {
  const user = await Users.findOne({ id: id });
  console.log("Deserialized user:", user);
  done(null, user);
});
