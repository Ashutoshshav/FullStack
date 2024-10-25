const { connectDB, sql } = require("../Utils/Connection");
let jwt = require('jsonwebtoken')
require('dotenv').config();

function setToken(employee) {
    if(employee) {
        let token = jwt.sign(
            {
                id: employee.EmployeeID,
                email: employee.EmployeeEmail,
                role: employee.EmployeeRole,
            },
            process.env.SECRET_KEY
        )
        
        return token;
    } else {
        return "employee is not coming in setToken"
    }
}

function getEmployee(token) {
    if(!token) {
        return "token not getting in getToken"
    } else {
        try {
            let employee = jwt.verify(token, process.env.SECRET_KEY)
            return employee;
        } catch(err) {
            console.log(err + " getToken")
        }
    }
}

// function setTokenForAdmin(admin) {
//     if(admin) {
//         let token = jwt.sign(
//             {
//                 id: admin.Admin_id,
//                 email: admin.Email,
//                 mob: admin.MobNo,
//             },
//             process.env.ADMIN_SECRET_KEY
//         )
        
//         return token;
//     } else {
//         return console.log("Admin is not coming in setToken")
//     }
// }

// function getAdminByToken(token) {
//     if(!token) {
//         return "token not getting in getAdminByToken"
//     } else {
//         try {
//             let admin = jwt.verify(token, process.env.ADMIN_SECRET_KEY)
//             return admin;
//         } catch(err) {
//             console.log(err + " getAdminByToken")
//         }
//     }
// }

module.exports = {
    setToken,
    getEmployee,
}
