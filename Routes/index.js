const express=require('express');
const router=express.Router();

console.log('Router Reloaded');

router.use('/',require('./user'));
router.use('/review',require('./review'));

module.exports=router;