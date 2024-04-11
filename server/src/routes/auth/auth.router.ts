import express from "express";
import passport from "passport";
import "./passport.js";

export const authRouter = express.Router();

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

authRouter.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
    successRedirect: "http://localhost:3000/dashboard",
    scope: ["email", "profile"],
  }),
  (req, res) => {
    console.log("Google called us back!");
  }
);

authRouter.get("/secret", (req, res) => {
  res.send(`User, ${req.user?.username}`);
});

authRouter.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:3000/");
  });
});
