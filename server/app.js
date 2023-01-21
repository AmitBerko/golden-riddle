const express = require('express')
const path = require('path')
const calculate = require('./calculator')
const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'build')))

// Main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
})

// Calculation API
app.get('/calculate/:extraWeight', (req, res) => {
    const extraWeight = Number(req.params.extraWeight)
    const result = calculate(extraWeight)
    res.json(result)
})

app.listen(80, () => {
    console.log(`Server is listening on port 80`)
})