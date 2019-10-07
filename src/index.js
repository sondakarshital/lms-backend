const express = require('express')
var cors = require('cors')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const uploadRouter = require('./routers/upload')
const resetPasswordRouter = require('./routers/reset-password');
const mailVerifier = require('./routers/mail-verifier');

const app = express()

const port = process.env.PORT || 3000

app.use(cors());
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(uploadRouter)
app.use(resetPasswordRouter);
app.use(mailVerifier);

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const Task = require('./models/task')
const User = require('./models/user')

//main();

