const express = require('express')
const path = require('path')
const calculate = require('./calculator')
const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'build')))

const port = process.env.PORT || 8060

// Main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
})

// Calculation Server
app.get('/calculate/:extraWeight', (req, res) => {
    const extraWeight = Number(req.params.extraWeight)
    const result = calculate(extraWeight) // Using the calculate function
    res.json(result)
})

app.listen(port, () => {
    console.log(`Server is listening on localhost:${port}`)
})