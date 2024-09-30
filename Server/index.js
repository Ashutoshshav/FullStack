const express = require("express");
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
require('iisnode-env').config();

const app = express();
const config = require("./Utils/Connection");
const { handleVerifyUser } = require("./Middlewares/UserTokenVerify");

const productRoute = require("./Routes/ProductRoute");
const cartRoute = require("./Routes/CartRoute");
const orderRoute = require("./Routes/OrderRoute");
const userRoute = require("./Routes/UserRoute");
const { scheduleInvoice } = require("./Controllers/InvoiceControllers");

const port = process.env.PORT || 3000;

// Middleware configurations
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["*"],
    credentials: true
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public/dist folder
app.use(express.static(path.join(__dirname, 'public', 'dist')));

// API routes
app.use("/api/user/", userRoute);
app.use("/api/cart/", handleVerifyUser, cartRoute);
app.use("/api/order/", handleVerifyUser, orderRoute);
app.use("/", productRoute);

// Catch-all handler for any requests that don’t match an API route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dist', 'index.html'));
});

// Schedule invoices
scheduleInvoice();

// Start the server
app.listen(port, () => {
    console.log("Server is running on " + port);
});

// Uncomment and implement the database connection if needed
// async function connection() {
//     try {
//         let pool = await sql.connect(config);
//         console.log("DB connected");
//     } catch (e) {
//         console.log(e);
//     }
// }

// connection();
