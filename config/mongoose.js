// require('dotenv').config();
const mongoose=require('mongoose');
require('dotenv').config();
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://khanjamshed404:Khan786786@cluster0.y5khj3z.mongodb.net/?retryWrites=true&w=majority')


const db=mongoose.connection;

db.on('error',console.error.bind(console,"Error to connect with mongodb"))

db.once('open',()=>{
    console.log('Connected to Database:mongodb')
})

module.exports=db;