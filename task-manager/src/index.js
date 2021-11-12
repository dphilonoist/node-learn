const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/user')
const taskRouter = require('./router/task')
var cors = require('cors')

const app = express() 
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(PORT, () => {
    console.log('server started at ' + PORT)
})