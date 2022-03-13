const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../util/errorResponse');
const Review = require('../models/Review');


// route /api/v1/review
// route /api/v1/bootcamp/:bootcampId/reviews;

exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      total: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
    // query = Course.find().populate();
  }
});

// route /api/v1/reviews/:id
// public

exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: review });
});

// create 
// private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  const review = await Review.create(req.body);

  res.status(200).json({ success: true, data: review });
});


// update
exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id)
  
    if (!review) {
      return next(
        new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
      );
    }
    if(review.user.usertoString() !== req.user.id && req.user.role !== 'admin'){
        return next(
            new ErrorResponse(`Not authroized to upate review`, 401)
          );
    }
     review = await Review.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true})
    res.status(200).json({ success: true, data: review });
  });

  // Delete Review
exports.deleteReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id)
  
    if (!review) {
      return next(
        new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
      );
    }
    if(review.user.usertoString() !== req.user.id && req.user.role !== 'admin'){
        return next(
            new ErrorResponse(`Not authroized to upate review`, 401)
          );
    }
     await review.remove();
    res.status(200).json({ success: true, data: {} });
  });

