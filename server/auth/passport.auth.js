"use strict";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";
import db from '../config/db.js';

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: ACCESS_TOKEN_SECRET,
};

passport.use(
    new JwtStrategy(options, async (jwt_payload, done) =>{
        try{
        const user = await db.query("SELECT * FROM usuarios WHERE email = ?", jwt_payload.email);
        if(user){
            return done(null, user);
        }else {
            return done(null, false);
        }
        }catch(error){
            return done(null, error);
        }
    }),
);

export function passportJwtSetUp(){
    passport.initialize();
}