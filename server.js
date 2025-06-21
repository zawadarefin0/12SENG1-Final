const express = require('express');
const path = require('path');
const cors = require('cors');
const { title } = require('process');

const app = express()
const port = 3000

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
})

app.listen(port, (error) => {
    if (error) {
        console.log("Error:", error)
    }
    console.log(`Server is running at http://localhost:${port}`)
    
})