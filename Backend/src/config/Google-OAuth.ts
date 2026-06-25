import passport from "passport";
import User from "../models/user";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {

            const email = profile.emails?.[0]?.value;

            let user = await User.findOne({ email });

            if (!user) {
                const names = profile.displayName.split(" ");

                user = await User.create({
                    FName: names[0] || "",
                    LName: names.slice(1).join(" ") || "",
                    email,
                    googleId: profile.id,
                });
            }

            done(null, user);
        }
    )
);

export default passport;