const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) =>{
    try{
        //extract jwt token
        const token = req.body.token || req.cokkies.token || req.header("Authorization").replace("");
        if(!token){
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        //verify the token
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
             
            req.user = decoded; //payload ko store kiya h taki next middleware m use kr ske isStudent ko verify krne k liye
        } catch(error){
            return res.status(401).json({
                success: false,
                message: "Token is not valid",
            });
        }
        next(); //next middleware
    }
    catch(error){
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying the token",
        });
    }
}

exports.isStudent = (req, res, next) => {
    try{
        if(req.user.role !== "Student"){
            return  res.status(500).json({
                success: false,
                message: "You are not a student",
            });
        }
        next();
    } catch(error){
        return res.status(500).json({
            success: false,
            message: "User role is not matching",
        })

    }
}

exports.isAdmin = (req, res, next) => {
    try{
        if(req.user.role !== "Admin"){
            retunr = res.status(401).json({
                success: false,
                message: "You are not a Admin",
            });
        }
        next();
    } catch(error){
        return res.status(500).json({
            success: false,
            message: "User role is not matching",
        })

    }
}