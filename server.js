const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./db/database')
const path = require('path');


const app = express()
const port = 3000

app.use(session({
  secret: 'petcarer_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
  }
}));

const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pet');
const adminRoutes = require('./routes/admin')


app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/assets', express.static(path.join(__dirname, 'frontend', 'assets')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'assets', 'favicon.ico'));
});

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/pets', petRoutes);
app.use('/admin', adminRoutes);

app.listen(port, (error) => {
    if (error) {
        console.log("Error:", error)
    }
    console.log(`Server is running at http://localhost:${port}`)
    
})