const express = require('express');
const passport = require('passport');
const router = express.Router();

const userController = require('../Controllers/user_controller')
const dashController = require('../Controllers/dashboard_controller');

router.get('/', userController.login);
router.get('/signup', userController.signup);
router.get('/signOut', userController.destroySeassion);
router.get('/admin', dashController.admin);
router.get('/employee/:id', dashController.employee);
router.get('/add-employee', userController.addEmployee);
router.get('/edit-employe/:id', userController.editEmployee);

router.post('/update-employee/:id',userController.updateEmployee)


router.post('/create', userController.create);
router.post('/create-employee', userController.createEmployee);


router.post('/createSession', passport.authenticate('local', { failureRedirect: '/' }), userController.createsession)

router.get('/destroy/:id',userController.destroy)


module.exports = router