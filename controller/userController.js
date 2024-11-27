const asyncHandler = require('express-async-handler')
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userController = {
    register: asyncHandler(async(req,res) => {
        const {username, email, password} = req.body

        if(!username || !email || !password) {
            throw new Error('All fields are required.')
        }

        const userExist = await User.findOne({email})

        if(userExist) {
            throw new Error('This email is already registered.')
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)

        const createUser = await User.create({
            email,
            username,
            password: hashedPass
        })
        res.json({
            message:'User registered',
            createUser
        })
    }),
    login: asyncHandler(async(req,res) => {
        const { email, password } = req.body

        const user = await User.findOne({email})

        if(!user) {
            throw new Error('Invalid login credentials')
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            throw new Error('Invalid login credentials')
        }

        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET,{
            expiresIn: "30d"
        })
        
        res.json({
            message:'Login successful',
            token,
            user

        })
    }),
    profile: asyncHandler(async(req,res) => {
        const { email } = req.body

        const user = await User.findOne({email})

        if(!user) {
            throw new Error('User not found')
        }

        const {username} = user

        res.json({
            message:'User profile',
            username
        })
    }),
    update_password: asyncHandler(async(req,res) => {
        const {newPass} = req.body
        const user = await User.findById(req.user)

        if(!user) {
            throw new Error('User not found')
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(newPass,salt)
        user.password = hashedPass

        await user.save({
            validateBeforeSave: false
        })

        res.json('Password change success')

    }),
    update_email: asyncHandler(async(req,res) => {
        const {newEmail} = req.body
        const user = await User.findById(req.user)

        if(!user) {
            throw new Error('User not found')
        }

        user.email = newEmail

        await user.save({
            validateBeforeSave: false
        })

        res.json('Email change success')
    }),
    delete: asyncHandler(async(req,res) => {
        const {id} = req.body;
        const userProfile = await User.findByIdAndDelete(id)

        if(!id) {
            throw new Error('Please provide more information')
        }

        res.send(
            userProfile
        )
    })
}

module.exports = userController