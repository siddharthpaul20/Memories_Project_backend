import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// user likes a post
//click the like button => auth middleware (next) => like controller ..

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500; // if true then token is made by us, and if false, then it is a google auth token

        let decodedData;

        if(token && isCustomAuth)
        {
            decodedData = jwt.verify(token, process.env.SECRET_STRING);
            req.userId = decodedData?.id;
        }
        else
        {
            // it is google auth token
            decodedData = jwt.verify(token);
            req.userId = decodedData?.sub;
        }
        next();

    } catch(error) {
        console.log(error);
    }

};

export default auth;