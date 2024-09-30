const { connectDB, sql } = require("../Utils/Connection");
let jwt = require('jsonwebtoken')
require('dotenv').config();

function setToken(user) {
    if(user) {
        let token = jwt.sign(
            {
                id: user.Cust_ID,
                email: user.Email,
                mob: user.MobNo,
            },
            process.env.SECRET_KEY
        )
        
        return token;
    } else {
        return "user is not coming in setToken"
    }
}

function getUser(token) {
    if(!token) {
        return "token not getting in getToken"
    } else {
        try {
            let user = jwt.verify(token, process.env.SECRET_KEY)
            return user;
        } catch(err) {
            console.log(err + " getToken")
        }
    }
}

module.exports = {
    setToken,
    getUser,
}
