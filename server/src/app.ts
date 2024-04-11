import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import passport from "passport";
import cookieSession from "cookie-session";

import api from "./routes/api.js";
import { authConfig } from "./routes/auth/passport.js";

const app = express();

app.use(helmet());
app.use(
  cookieSession({
    name: "linguardian-session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [authConfig.COOKIE_KEY_1, authConfig.COOKIE_KEY_2],
  })
);
// This is a workaround for a bug in passport 0.5.x: https://github.com/jaredhanson/passport/issues/904
app.use(function (request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb: any) => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb: any) => {
      cb();
    };
  }
  next();
});
// Workaround end
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use("/", api);

export default app;
