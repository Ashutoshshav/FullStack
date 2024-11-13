const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail", // or your preferred email service
    auth: {
        user: process.env.INVOICE_EMAIL, // your email address
        pass: process.env.INVOICE_PASS, // your email password or app password
    },
});

async function handleSendEmail(emailAddress, msg) {
    // Email options
    const mailOptions = {
        from: process.env.INVOICE_EMAIL, // sender address
        to: emailAddress, // recipient address
        subject: "Your Presence", // subject line
        text: msg, // plain text body
        // attachments: [
        //     {
        //         filename: "invoice.pdf",
        //         content: pdfBuffer,
        //         contentType: "application/pdf",
        //     },
        // ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return mailOptions;
}

module.exports = {
    handleSendEmail,
}
