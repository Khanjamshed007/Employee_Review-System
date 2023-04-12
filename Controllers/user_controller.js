const User = require('../model/user');
const passport = require('passport');
const Review = require('../model/review');


// Rendering the login page 
module.exports.login = (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'admin') {
            return res.redirect('/admin')
        }
        // if the user is not admin
        return res.redirect(`employee/${req.user.id}`);
    }
    return res.render('login', {
        title: 'ER_System | Login'
    })
}

// Rendering the sign-Up Page
module.exports.signup = (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'admin') {
            return res.redirect('/admin');
        }
        return res.redirect(`employee/${req.user.id}`);
    }
    return res.render('signUp', {
        title: 'ER_System | Sign-Up'
    })
}

// Redner add-employee page
module.exports.addEmployee = (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'admin') {
            return res.render('add_employee', {
                title: 'Add Employee'
            });
        }
    }
    return res.redirect('/');
}

// Rendering edit employee page
module.exports.editEmployee = async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            if (req.user.role === 'admin') {
                // populate employee with all the review (Feedback) given by other users
                const employee = await User.findById(req.params.id).populate({
                    path: 'reviewsFromOthers',
                    populate: {
                        path: 'reviewer',
                        model: 'User',
                    },
                });

                // Extracting reviews given by others from employee variable
                const reviewsFromOthers = employee.reviewsFromOthers;

                return res.render('edit_employee', {
                    title: 'Edit Employee',
                    employee, reviewsFromOthers,
                });
            }
        }
        return res.redirect('/')
    } catch (err) {
        console.log('error', err);
        return res.redirect('back');
    }
}

// update Employee Details
module.exports.updateEmployee = async (req, res) => {
    try {
        const employee = await User.findById(req.params.id);
        const { name, role } = req.body;

        if (!employee) {
            req.flash('error', 'Employee does not exists!')
            return res.redirect('back');
        }

        // update data coming form req.body
        employee.name = name;
        employee.role = role;
        employee.save(); //save the updated data

        req.flash('success', "Employee details updated!");
        return res.redirect('back');
    } catch (err) {
        console.log('error', err);
        return res.redirect('back');
    }
}

// Get the User Data from Sign Up
module.exports.create = async (req, res) => {
    try {
        const { name, email, password, confirm_password, role } = req.body;

        // if the password doesn't match 
        if (password != confirm_password) {
            req.flash('error', 'Password are not same')
            return res.redirect('back')
        }
        // if the user is already exist
        User.findOne({ email }, async (err, user) => {
            if (err) {
                console.log('Error in finding user in signing up');
                return;
            }
            // if the user not found in db then create one
            if (!user) {
                User.create({
                    email, password, name, role,
                },
                    (err, user) => {
                        if (err) {
                            req.flash('error', "Couldn't sign Up");
                        }
                        req.flash('success', 'Account created!');
                        return res.redirect('/');
                    });
            } else {
                req.flash('error', 'User already registed!');
                return res.redirect('back');
            }
        });
    } catch (err) {
        console.log('error', err);
        return res.redirect('back');
    }
};

// Add on Employee
module.exports.createEmployee = async (req, res) => {
    try {
        const { name, email, password, confirm_password } = req.body;

        // If password doesn't match
        if (password != confirm_password) {
            req.flash('error', 'Password are not same');
            return res.redirect('back');
        }

        // check if user already exists
        User.findOne({ email }, async (err, user) => {
            if (err) {
                console.log("Error in finding user in signing up ");
                return;
            }

            // If the user not found in db create one
            if (!user) {
               await User.create({
                    email, password, name,
                },
                    (err, user) => {
                        if (err) {
                            req.flash('error', "Couldn't Add Employee");
                        }
                        req.flash('success', 'Employee Added!');
                        return res.redirect('/admin')
                    }
                );
            } else {
                req.flash('error', "Employee Already Registed!");
                return res.redirect('back')
            }
        });
    } catch (err) {
        console.log('error', err);
        return res.redirect('back');
    }
}

// Sign in and create a session for the user
module.exports.createsession = (req, res) => {
    req.flash('success', 'Logged in successfully');
    if (req.user.role === 'admin') {
        return res.redirect('/admin');
    }
    // if the user is not admin then redirect  to employee page
    return res.redirect(`/employee/${req.user.id}`)
}

module.exports.destroySeassion = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out Successfully');
        return res.redirect('/');
    })
}

// Delete an user
module.exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        // delete all the reviews in which this is user is a recipient
        await Review.deleteMany({ recipient: id });

        // delete all the reviews in which  this user is a reviewer
        await Review.deleteMany({ reviewer: id });


        // Delete this user
        await User.findByIdAndDelete(id);


        req.flash('error', `User deleted successfully!`)
        return res.redirect('back');
    } catch (err) {
        console.log('error', err);
        return res.redirect('back');
    }
}


