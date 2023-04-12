// require('dotenv').config();
const mongoose=require('mongoose');
require('dotenv').config();
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost/ER-System')


const db=mongoose.connection;

db.on('error',console.error.bind(console,"Error to connect with mongodb"))

db.once('open',()=>{
    console.log('Connected to Database:mongodb')
})

module.exports=db;