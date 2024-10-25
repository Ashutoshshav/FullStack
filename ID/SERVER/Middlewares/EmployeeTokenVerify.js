let { getEmployee } = require("../Services/EmployeeAuthentication")

const handleVerifyEmployee = (allowedRoles) => async (req, res, next) => {
    let token = req.headers['authorization'];

    if(!token) {
        return res.status(400).send("Please Login 1")
    }

    try {
        // console.log(token)
        
        let employee = getEmployee(token)
        
        if(!employee) {
            return res.status(400).send("Please Login 2")
        } 

        if (!allowedRoles.includes(employee.role)) {
            
            return res.status(403).send('Access denied.');
        }
        // console.log(employee.role);
    
        req.employee = employee
    
        next()
    } catch(err) {
        console.log(err);
    }

}

module.exports = {
    handleVerifyEmployee,
}
