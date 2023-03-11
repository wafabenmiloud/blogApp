const dotenv = require('dotenv');
const express = require('express');
const Connection = require('./db/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Router = require('./routes/routes')

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

//clien side origin
// app.use(cors({credentials: true, origin: ['https://blog-xj3p.onrender.com']}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://blog-xj3p.onrender.com');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  app.set("trust proxy", 1);


//upload image
app.use('/uploads', express.static(__dirname + '/uploads'));

//Database
const mongoURI = process.env.MONGODB_URI;
Connection(mongoURI);

//ROUTER
app.use('/', Router);

// server
const PORT = 2000;
app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));
