const asyncHandler = require("../middleware/async");
const User = require('../models/User');




// @description Get all users
// @route PUT /api/v1/auth/users
// @access Private/Admin

exports.getUsers =asyncHandler(async(req, res,next)=>{
   
    res.status(200).json(res.advancedResults);
})


// @description get signle user
// @route PUT /api/v1/auth/users/:id
// @access Private/Admin


exports.getUser =asyncHandler(async(req, res,next)=>{
    const user = await User.findByIdAndUpdate(req.params.id);
    res.status(200).json({success: true, data: user});
})

// @description Create user
// @route PUT /api/v1/auth/users/
// @access Private/Admin


exports.createUser =asyncHandler(async(req, res,next)=>{
    const user = await User.create(req.body);
    res.status(201).json({success: true, data: user});
})


// @description upadate user
// @route PUT /api/v1/auth/users/:id
// @access Private/Admin


exports.updateUser =asyncHandler(async(req, res,next)=>{
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({success: true, data: user});
})

// @description delet user
// @route DELETE /api/v1/auth/users/:id
// @access Private/Admin



exports.deleteUser =asyncHandler(async(req, res,next)=>{
    await User.findByIdAndUpdate(req.params.id);
    res.status(200).json({success: true, data: {} });
})