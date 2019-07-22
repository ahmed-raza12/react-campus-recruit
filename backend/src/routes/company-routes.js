const express = require('express');
const Companies = require('../models/companyform');
const auth = require('../middleware/auth');
const multer = require('multer');
const routes = express.Router()
// const {sendWelcomeMail, sendGoodByeMail} = require('../emails/profile');
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

routes.post('/company', async (req, res) => {
    console.log(req.body, 'comp');
    try {
        const company = await Companies(req.body).save()
        const token = await company.generateAuthToken()
        // sendWelcomeMail(company.name)
        res.send({company, token})
    } catch (e) {
        res.status(400).send(e)
    }

})

routes.get('/company', async (req, res) => {
    try {
        const allCompanies = await Companies.find({})
        if (!allCompanies) {
            res.status(404).send()
        }

        // const publicProfiles = Profiles.sendPublicDataOnly(allProfiles)
        res.send(allCompanies)
    } catch (e) {
        res.status(500).send(e)
    }
})

routes.get('/company/mycompany', auth.authCompany , async (req, res) => {

    // const id = req.params.id
    try {
        // const profile = await Profiles.findById(id)
        const company = req.company
        await company.populate('wishList').execPopulate()
        // console.log(id, profile)
        // if (profile._id.toString() !== id) {
        //     res.status(404).send()
        // }
        res.send(company)
    } catch (e) {
        res.status(500).send(e)
    }
})

routes.patch('/company/mycompany', async (req, res) => {
    console.log(req.body)
    const changedCompany = req.body
    const fieldsToUpdate = Object.keys(changedCompany);
    const fieldsInModel = ['companyName', 'email', 'owner', 'description', 'type', '_id'];
    console.log(fieldsToUpdate, fieldsInModel, 'filed')
    const isUpdateAllowed = fieldsToUpdate.every((field) => fieldsInModel.includes(field))
    console.log(isUpdateAllowed, 'allowed')
    if (!isUpdateAllowed) {
        return res.status(404).send({ Error: "Invalid fields" })
    }
    try {
        const myCompany = await Companies.findByIdAndUpdate(req.body._id, req.body, {new: true, runValidators: true})
        // const profile = await Profiles.findById(req.params.id)
        console.log(myCompany, 'company')
        if (!myCompany) {
            return res.status(404).send()
        }
        // company = req.company
        // Object.assign(company, changedCompany)
        await myCompany.save()
        res.send(myCompany)
    } catch (e) {
        res.status(500).send(e)
    }
})

routes.patch('/company', async (req, res) => {
    console.log(req.body)
    const changedCompany = req.body
    const fieldsToUpdate = Object.keys(changedCompany);
    const fieldsInModel = ['companyName', 'email', 'owner', 'description', 'type', '_id'];
    console.log(fieldsToUpdate, fieldsInModel, 'filed')
    const isUpdateAllowed = fieldsToUpdate.every((field) => fieldsInModel.includes(field))
    console.log(isUpdateAllowed, 'allowed')
    if (!isUpdateAllowed) {
        return res.status(404).send({ Error: "Invalid fields" })
    }
    try {
        const company = await Companies.findByIdAndUpdate(req.body._id, req.body, {new: true, runValidators: true})
        // const profile = await Profiles.findById(req.params.id)
        console.log(company, 'company')
        if (!company) {
            return res.status(404).send()
        }
        // company = req.company
        // Object.assign(company, changedCompany)
        await company.save()
        res.send(company)
    } catch (e) {
        res.status(500).send(e)
    }
})


routes.delete('/company', async (req, res) => {
    const { id } = req.body
    try {
        const company = await Companies.findByIdAndDelete(id);
        if (!company) {
            res.status(404).send()
        }
        // await req.company.remove()
        // sendGoodByeMail(req.company.companyName, req.profile.email)
        res.send(req.company)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})



routes.post('/company/login', async (req, res) => {
    try {
        const company = await Companies.findByCredentials(req.body.email, req.body.password, req.body.type)
        const token = await company.generateAuthToken()        
        res.send({ company, token})
    } catch (e) {
        res.status(500).send(e)
    }
})

routes.post('/admin/login', async (req, res) => {
    console.log(req.body,  'iot')
    try {
        const admin = await Companies.findByCredentialsAdmin(req.body.email, req.body.password, req.body.type)
        console.log(admin.type,'admin')
        const token = await admin.generateAuthToken()

        res.send({admin, token})
    } catch (e) {
        res.status(500).send(e)
    }
})

routes.post('/company/logout', auth.authCompany, async (req, res) => {    
    try {
        const {company, token} = req
        company.tokens = company.tokens.filter((t) => t.token !== token)
        await company.save()
        res.send()
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = routes