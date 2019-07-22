const express = require('express');
require('./db/mongoose');
const profileRoute = require('./routes/profile-routes');
const companyRoutes = require('./routes/company-routes');
const jwt = require('jsonwebtoken');
// const sellFormRoutes = require('./routes/sellform-routes');
var cors = require('cors');
// console.log(jwt.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDE2MmRjN2YxYTZjYjE3MDQ0MmE2ZTEiLCJpYXQiOjE1NjE5MDI2Mzd9.EKMqEpGznoVuSDojtbyJBRz7n8rTpiWEEPVD2giWS7Q', 'decoded'))
// const newRec = Profiles({
//     name: 'Hamid',
//     age: 10,
//     graduate: "false",
//     email: 'hr@gmail.com',
//     gender: "male"
// })

// newRec.save()
// .then(data => console.log(data))
// .catch(err => console.log(err))

const app = express();
app.use(cors());

const port = process.env.PORT

// app.use((req, res, next) => {
//     res.status(500).send('Sorry site is under maintainance! ')
//     next()
// })
app.use(express.json());
app.use(profileRoute)
app.use(companyRoutes)
// app.use(sellFormRoutes)


app.listen(port, () => {
    console.log('server runnig on ' + port);

})