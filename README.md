# Add-To-Calender-Nodejs
I used a node js application to schedule a meeting invite via smtp and icalEvent

usage
1. unzip the repository to a targeted dir.
2. open app.js in a text editor ;
  from line 79 smtp edit the values with that of your own smtp server details
  host: "smtp.domain.org",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "username", // generated ethereal user
      pass: "password", // generated ethereal password
    },

3. add sender and recipient in the send mail section

4. npm init 
5. node app.js
server runs @ localhost:3000
have fun !!!
