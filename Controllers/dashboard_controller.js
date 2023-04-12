const User = require('../model/user');
const Review = require('../model/review');


module.exports.admin = async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            if (req.user.role === 'admin') {
                // populate all users
                let users = await User.find({}).populate('name');

                // filter logged in user
                let filteredUsers = users.filter(
                    (user) => user.email != req.user.email
                );
                return res.render('admin', {
                    title: 'Admin',
                    users: filteredUsers,
                });
            } else {
                return res.redirect('back');
            }
        } else {
            return res.redirect('/');
        }
    } catch (err) {
        console.log(err);
        return res.redirect('/');
    }
}

module.exports.employee = async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            // populate the employee with reviews assigned to it and reviews from others
            const employee = await User.findById(req.params.id)
                .populate({
                    path: 'reviewsFromOthers',
                    populate: {
                        path: 'reviewer',
                        model: 'User',
                    },
                }).populate('assignedReviews');

            // extract the reviews assigned to it 
            const assignedReviews = employee.assignedReviews;

            // extract feedbacks from the others employess
            const reviewsFromOthers = employee.reviewsFromOthers;

            // populate reviews from others
            const populateResult = await Review.find().populate({
                path: 'reviewer',
                model: 'User',
            });
            return res.render('employee', {
                title: 'Employee',
                employee,
                assignedReviews,
                reviewsFromOthers,
            });
        } else {
            return res.redirect('/')
        }
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};