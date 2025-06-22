const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./db/database')
const path = require('path');


const app = express()
const port = 3000

const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pet');
const adminRoutes = require('./routes/admin')

// Session management
app.use(session({
    secret: 'petcarer_secret',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
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