const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const app = express();
const path = require('path');
const mysql = require('mysql');

app.use(express.urlencoded({ extended: false }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'nevin',
  password: 'mysql123',
  database: 'nevin'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.post('/action', function (req, resp) {
  const name = req.body.name;
  const mail = req.body.mail;
  const college = req.body.college;
  const year = req.body.year;

  const sql = 'INSERT INTO users (name, mail, college, year) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, mail, college, year], (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      return resp.status(500).send('Error storing user data');
    }
    console.log('User data inserted into MySQL');

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'nevinsajie@gmail.com',
        pass: 'Rubypa71%^$'
      }
    });

    const htmlContent = fs.readFileSync('mail.html', 'utf8');
    const cssContent = fs.readFileSync('mail.css', 'utf8');

    const mailOptions = {
      from: 'nevinsajie@gmail.com',
      to: mail,
      subject: 'Thank you for registering',
      text: `Hey ${name},\n\nThank you for registering "Capture the Flag" event presented by Free Software Club as a part of Dhishna\n\n`,
      html: htmlContent,
      attachments: [
        {
          filename: 'styles.css',
          content: cssContent,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    resp.sendFile(path.join(__dirname, 'response.html'));
  });
});

app.listen(3000);
