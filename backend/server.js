const express = require('express')
const path = require('path')

const app = express()
const port = 3000

app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));
console.log(path.join(__dirname, "../frontend"));

app.get('/', (req, res) => {
    res.send("hello world")
})


app.listen(port, (error) => {
    if (error) {
        console.log("Error:", error)
    }
    console.log(`Server is running at http://127.0.0.1:${port}`)
    
})