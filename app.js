const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const nodemailer = require("nodemailer");
const iCalEvent = require("icalevent");

const app = express();

// View engine setup
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Static folder
app.use("/public", express.static(path.join(__dirname, "public")));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("contact", {
    layout: false,
  });
});

app.post("/send", (req, res) => {
  const recepients = req.body.email;
  const startDateTime = req.body.start_date;
  const endDateTime = req.body.end_date * 1000;
  const milliseconds = endDateTime.toLocaleString();
  console.log(milliseconds);
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Title: ${req.body.title}</li>
      <li>Start Date / Time: ${req.body.start_date}</li>
      <li>End Date / Time: ${req.body.end_date}</li>
      <li>Location: ${req.body.location}</li>
      <li>Link: ${req.body.url}</li>
    </ul>
    <h3>Agenda</h3>
    <p>${req.body.message}</p>`;
  // ICAL Event code
  let event = new iCalEvent({
    uid: 9873647,
    offset: new Date().getTimezoneOffset(),
    method: "request",
    status: "confirmed",
    attendees: [
      {
        name: "Cephas Chapa",
        email: "cephaschapa@gmail.com",
      },
      {
        name: "cjr",
        email: "cephaschapa@gmail.com",
      },
    ],
    start: req.body.start_date,
    end: req.body.end_date,
    timezone: "CAT",
    summary: req.body.title,
    description: req.body.message,
    location: req.body.message,
    organizer: {
      name: "Cephas Chapa",
      email: "cephaschapa@gmail.com",
    },
    url: req.body.url,
  });

  console.log(event.start);
  let calenderFile = event.toFile();
  console.log(calenderFile);
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "support@report.probasegroup.com", // generated ethereal user
      pass: "pbs_support", // generated ethereal password
    },
    // tls: {
    //   rejectUnauthorized: false,
    // },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Cephas Chapa" <cephaschapa@gmail.com>', // sender address
    to: recepients, // list of receivers
    subject: event.summary, // Subject line
    text: "Attached to this meeting is a calender", // plain text body
    html: output,

    icalEvent: {
      filename: "meetings-invitation.ics",
      method: "request",
      content: calenderFile,
    },
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.render(
      "contact",
      // {
      //   layout: false,
      // },
      {
        msg: "Email has been sent",
      }
    );
  });
});

app.listen(3000, () => console.log("Server started..."));
