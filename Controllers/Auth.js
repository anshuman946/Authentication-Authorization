const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken")
require("dotenv").config();

// signup route handler
exports.signup = async (req, res) => {
    try{
        // get data
        const {name, email, password, role} = req.body;
        //check if user is already exsist
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400) .json({
                success: false,
                message: "User already exsist",
            });
        }
        // secure pass
        let hashPassword;
        try{
            // 2 param - pass n 10 is no of rounds
            hashPassword = await bcrypt.hash(password, 10);
            
        
        }
        catch(error){
            return res.status(500).json({
                success : false,
                message: "Error in hashing",
            })
        }
        //creating entry for user
        const user = await User.create({
            name,
            email,
            password:hashPassword,
            role,
        })
        return res.status(200).json({
            success: true,
            message: "User created",
        });
    }

    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered",
        });
    }
}
//login
exports.login = async(req, res) => {
    try{
        //data fetch from request
        const{email, password} = req.body;
        //validation on email n password
        // data nai hai agar
        if(!email || !password){  //agr dono m se kuch bhi present nai h
            return res.status(400).json({
                success: false,
                message: "Please enter email and password correctly",
            })
        }

        //check for resitered user
        //checking kya is entry(email) se koi entry db m h ki nai
        let user = await User.findOne({email}); // user k object nikala h db se
        //if not a registered user
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not registered",
            })
        }
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };
        //verify pass n generate a JWT token
        //ye fn normal data or encypted data ko compare krega db m hashed data h
        if(await bcrypt.compare(password,user.password)){
            //user.pass is encrypted data or pass normal data h jo user n enter kra h usko compare kr rhe h
            //jwt token creation
            let token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn: "2h",
            });

            user = user.toObject();
            user.token = token // entry insert krdi user ke object m jo upr find kra h using findOne
            user.password = undefined // password ko object se hata diya for security
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).json({
                success: true,
                token,
                user,
                message: "User logged in",
            })
        }

        
        else{
            return res.status(401).json({
                success: false,
                message: "Incorrect password",
            })
        }
    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in login",
        })
    }
}