const { db } = require('./firebase');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

module.exports.isCampAuthor = async (req, res, next) => {
    try {
      console.log('Current user:', req.user); // Debug log
      console.log('Camp ID:', req.cookies.userId); // Debug log
        const campDoc = await db.collection('campgrounds').doc(req.params.id).get();
        if (!campDoc.exists) {
            req.flash('error', 'Campground not found');
            return res.redirect('/camps');
        }
        if (campDoc.data().author !== req.cookies.userId) {
            req.flash('error', 'You do not have permission to do that');
            return res.redirect(`/camps/${req.params.id}`);
        }
        next();
    } catch (error) {
        console.log(error)
        req.flash('error', 'Something went wrong');
        res.redirect('/camps');
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const reviewId = req.params.reviewId;
    try {
        const reviewDoc = await db.collection('reviews').doc(reviewId).get();
        if (!reviewDoc.exists) {
            req.flash('error', 'Review not found.');
            return res.redirect('/camps');
        }
        const review = reviewDoc.data();
        if (review.author !== req.user.id) {
            req.flash('error', 'You do not have permission to do that.');
            return res.redirect('/camps');
        }
        next();
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong.');
        res.redirect('/camps');
    }
};