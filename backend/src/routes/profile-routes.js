const express = require('express');
require('../db/mongoose');
const Profiles = require('../models/profiles');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const {sendWelcomeMail, sendGoodByeMail} = require('../emails/profile');
const routes = express.Router()
// const newRec = Profiles({
//     name: 'Hamid',
//     age: 10,
//     graduate: "false",
//     email: 'hr@gmail.com',
//     gender: "male"
// })

// newRec.save()
// .then(data => console.log(data))
// .catch(err => console.log(err))
const uploadImage = multer({
    limits: {
        // fileSize: 100000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|PNG|pdf)$/)) {
            return cb(new Error('please upload an Image'))
        }
        cb(undefined, true)
    }
})



routes.post('/profiles/uploadfile', auth.authProfile, uploadImage.array('avatar'), async (req, res) => {
    // req.profile.avatar = req.file.buffer
    // await req.profile.save()
    const buffer = await sharp(req.file.buffer).resize({
        width: 200,
        height: 200
    }).png().toBuffer()
    console.log(buffer)
    req.profile.avatar = buffer
    await req.profile.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message})
})

routes.delete('/profiles/myavatar', auth.authProfile, async (req, res) => {
    req.profile.avatar = undefined
    await req.profile.save()
    res.send()
})

routes.get('/profiles/myprofile/avatar', auth.authProfile, async (req, res) => {
    try {
        const profile = req.profile
        if(!profile.avatar) {
            throw new Error()
        }
        res.set('Content-type', 'image/png')
        res.send(profile.avatar)
    } catch (e) {
        res.status(404).send()
    }
})


routes.post('/profiles', async (req, res) => {
    console.log(req.body);
    try {
        const profile = await Profiles(req.body).save()
        const token = await profile.generateAuthToken()
        // sendWelcomeMail(profile.name)
        res.send({profile, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

routes.get('/profiles', async (req, res) => {
    try {
        const allProfiles = await Profiles.find({})
        if (!allProfiles) {
            res.status(404).send()
        }

        // const publicProfiles = Profiles.sendPublicDataOnly(allProfiles)
        res.send(allProfiles)
    } catch (e) {
        res.status(500).send(e)
    }
})

routes.get('/profiles/myprofile', auth.authProfile , async (req, res) => {

    // const id = req.params.id
    try {
        // const profile = await Profiles.findById(id)
        const profile = req.profile
        await profile.populate('wishList').execPopulate()
        // console.log(id, profile)
        // if (profile._id.toString() !== id) {
        //     res.status(404).send()
        // }
        res.send(profile)
    } catch (e) {
        res.status(500).send(e)
    }
})

routes.patch('/profiles', async (req, res) => {
    const changedProfile = req.body
    // console.log(req.body, 'reqbody')
    const fieldsToUpdate = Object.keys(changedProfile);
    const fieldsInModel = ['name', 'fatherName', 'grNo', 'address', 'mobileNo', 'gender', 'type', 'email', 'password', '_id'];
    const isUpdateAllowed = fieldsToUpdate.every((field) => fieldsInModel.includes(field))
    console.log(isUpdateAllowed, 'isallower')
    if (!isUpdateAllowed) {
        return res.status(404).send({ Error: "Invalid fields" })
    }
    try {
        const profile = await Profiles.findByIdAndUpdate(req.body._id, req.body, {new: true, runValidators: true})
        // const profile = await Profiles.findById(req.params.id)

        if (!profile) {
            return res.status(404).send()
        }
        console.log(profile, 'updated')
        // profile = req.profile
        // Object.assign(profile, changedProfile)
        await profile.save()
        res.send(profile)
    } catch (e) {
        res.status(500).send(e)
    }
})


routes.delete('/profiles', async (req, res) => {
    const { id } = req.body
    console.log(id)
    try {
        const profile = await Profiles.findByIdAndDelete(id);
        if (!profile) {
            res.status(404).send()
        }
        // sendGoodByeMail(req.profile.name, req.profile.email)
        res.send(req.profile)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})



routes.post('/profiles/login', async (req, res) => {
    console.log(req.body,  'req.body login route')  
    try {
        const profile = await Profiles.findByCredentials(req.body.email, req.body.password)
        const token = await profile.generateAuthToken()

        // const publicData = profile.sendPublicDataOnly()
        // console.log(publicData,'pb');
        console.log(profile, token, 'data')
        
        res.send({ profile, token})

    } catch (e) {
        res.status(500).send(e)
    }
})

routes.post('/profiles/logout', auth.authProfile, async (req, res) => {    
    try {
        const {profile, token} = req
        console.log(profile, 'logout profile')
        profile.tokens = profile.tokens.filter((t) => t.token !== token)
        await profile.save()
        res.send()
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = routes