const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../util/errorResponse');

// route /api/v1/courses
// route /api/v1/bootcamp/:bootcampId/courses;

exports.getCourses = asyncHandler(async (req, res, next) => {
  
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).jsn({
      success: true,
      total: courses.length,
      data: courses
    })
  } else {
    res.status(200).json(res.advancedResults)
    // query = Course.find().populate();
  }
  // const courses = await query;
  // res.status(200).json({ success: true, total: courses.length, data: courses });
});
// get single course
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });
  if (!course) {
    return new ErrorResponse(`resources not found with id ${req.params.id}`);
  }
  res.status(200).json({ success: true, data: course });
});

// create course
exports.addCourse = asyncHandler(async (req, res, next) => {

  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return new ErrorResponse(`resources not found with id ${req.params.id}`);
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not authorized to add a course`,
        401
      )
    );
  }
  const course = await Course.create(req.body);

  res.status(200).json({ success: true, data: course });
});
// update course
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return new ErrorResponse(`resources not found with id ${req.params.id}`);
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not authorized to update a course`,
        401
      )
    );
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({success: true, data: course});
});
// delete course
exports.deleteCourse = asyncHandler(async(req, res, next)=>{
  const course = await Course.findById(req.params.id);
  if(!course){
    return new ErrorResponse(`resources not found with id ${req.params.id}`);
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not authorized to delete  a course`,
        401
      )
    );
  }
  course.remove();
 res.status(200).json({success: true, data: {}});
})


