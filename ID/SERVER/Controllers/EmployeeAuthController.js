const { connectDB, sql } = require("../Utils/Connection");
let { setToken, getEmployee } = require("../Services/EmployeeAuthentication")

async function handleEmployeeSignup(req, res) {
    let { name, mobileno, email, role, password } = req.body;
    // let Name_of_Cust = name
    // let MobNo = mobileno
    // let Email = email
    // let Address = address
    // let GSTNo = gstno
    // let Password = password
    // let Cat_ID = 1;
    // console.log(Name_of_Cust, MobNo, Email, Address, GSTNo, Password)
    console.log(name, mobileno, email, role, password)
    try {
        const pool = await connectDB()

        const fetchEmployee = await pool.request()
            .input('email', sql.VarChar, email) 
            .input('mobileno', sql.VarChar, mobileno)  
            .query(`SELECT * FROM EmployeeMaster WHERE EmployeeEmail = @email OR EmployeeMob = @mobileno`);

        // Log the fetched user
        console.log(fetchEmployee.recordset.length);

        if(fetchEmployee.recordset.length === 0) {
            let result = await pool.request()
                                .query(`SELECT MAX(EmployeeID) AS Last_Employee FROM EmployeeMaster`)

            let Last_Employee = result.recordset[0].Last_Employee
            console.log(Last_Employee)
            let EmployeeID = Last_Employee + 1

            const result2 = await pool.request()
                .input('EmployeeID', sql.Int, EmployeeID)
                .input('name', sql.VarChar, name)
                .input('mobileno', sql.Int, mobileno)
                .input('email', sql.VarChar, email)
                .input('role', sql.VarChar, role)
                .input('password', sql.VarChar, password)
                .query(`INSERT INTO EmployeeMaster (EmployeeID, EmployeeName, EmployeeMob, EmployeeEmail, EmployeeRole, EmployeePassword) VALUES (@EmployeeID, @name, @mobileno, @email, @role, @password)`)
    
            // console.log(result)
            return res.status(200).send("Signup Successfully")
        } else {
            return res.send("Employee already exist please Login")
        }
    } catch (err) {
        console.log(err)
        res.status(400).send("Not Signup")
    }
}

async function handleEmployeeLogin(req, res) {
    let { email, password } = req.body;
    // let Password = password
    // console.log(email, password)
    try {
        const pool = await connectDB()

        let result = await pool.request()
            .input('email', sql.VarChar, email)
            .query(`SELECT * FROM EmployeeMaster WHERE EmployeeEmail = @email`)

        if (result.recordset.length === 0) {
            return res.send("Employee not Exist")
        }

        let Employee = result.recordset[0];
        console.log(Employee)
        if (Employee.EmployeeID) {
            if (Employee.EmployeePassword == password) {
                let token = setToken(Employee)
                console.log(token)
                // console.log(Employee.EmployeePassword)
                return res.json({ token: token })
            } else {
                return res.send("Password is Wrong")
            }
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    handleEmployeeSignup,
    handleEmployeeLogin,
}
