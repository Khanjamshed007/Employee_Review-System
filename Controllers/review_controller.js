const User = require('../model/user');
const Review = require('../model/review');

// Assign a review
module.exports.assignReview = async (req, res) => {
    const { recipient_email } = req.body;
    try {
        if (req.isAuthenticated()) {
            const reviewer = await User.findById(req.params.id);
            const recipient = await User.findOne({ email: recipient_email });

            // Check if review already assigned
            const alreadyAssigned = reviewer.assignedReviews.filter(
                (userId) => userId == recipient.id
            );

            // if found,prevent form assigning duplicates review
            if (alreadyAssigned.lenth > 0) {
                req.flash('error', 'Review already assigned!');
                return res.redirect('back');
            }

            // update reviewers assignedReviews field by putting reference of recipient
            await reviewer.updateOne({
                $push: { assignedReviews: recipient },
            });

            req.flash('success', `review Assigned successfully!`);
            return res.redirect('back');
        } else {
            req.flash('error', `Couldn't assign the review`);
        }
    } catch (err) {
        console.log('error: ', err)
    }
}

// Submit Review
module.exports.submitReview = async (req, res) => {
    const { recipient_email, feedback, star } = req.body;
    try {
        const recipient = await User.findOne({ email: recipient_email });
        const reviewer = await User.findById(req.params.id);

        // Create a new review
        const review = await Review.create({
            review: feedback,
            reviewer, recipient,
        });

        // Remove all extra spaces from the review
        const reviewString = review.review.trim();

        // Prevent from submitting empty feedback
        if (reviewString === '') {
            req.flash('error', `Feedback section can't be empty!`);
            return res.redirect('back');
        }

        // put reference of newly created review to recipints schema
        await recipient.updateOne({
            $push: {
                reviewsFromOthers: review
            },
        });

        // remove reference of the recipient from the reviewer's assignedviews field
        await reviewer.updateOne({
            $pull: { assignedReviews: recipient.id },
        });

        req.flash('success', `review submitted successfully!`);
        return res.redirect('back');
    } catch (err) {
        console.log('error', err)
    }
};

//Update Review
module.exports.updateReview = async (req, res) => {
    try {
        const { feedback } = req.body;
        const reviewToBeUpdated = await Review.findById(req.params.id);

        // If review not found
        if (!reviewToBeUpdated) {
            req.flash('error', 'Review does not exist!');
        }

        reviewToBeUpdated.review = feedback;  //Assigning the feedback string coming from form body to review
        reviewToBeUpdated.save();  //Saving the Review
        req.flash('success', 'Review Updated!');
        return res.redirect('back');
    } catch (err) {
        console.log(err);
    }
} 