const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const companySchema = new mongoose.Schema({
    companyName: {
        type: String
    },
    owner: {
        type: String
    },
    description: {
        type: String,
    },
    type: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not correct")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')) {throw Error('password can not contain "password"')}
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
}, { timestamps: true})
companySchema.pre('save', async function(next){
    const company = this // fun should not be arrow
    if(company.isModified('password')) {
        company.password = await bcrypt.hash(company.password, 8)
    }
    next()
})

companySchema.pre('remove', async function(next){
    const company = this // fun should not be arrow
    
    // await Companies.deleteMany({
    //     wishedBy: company._id
    // }) 
    
    // next()
})

companySchema.pre('remove', async function(next){
    const company = this // fun should not be arrow
    
    await SellForm.deleteMany({
        addedBy: company._id
    }) 
    
    next()
})

companySchema.statics.findByCredentials = async (email, password, type) => {
    const company = await Companies.findOne({email})
    
    if(!company) {
        throw Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, company.password)

    if(!isMatch){
        throw Error('Unable to login')
    }
    if(company.type === 'company'){
        return company
    }
}

companySchema.statics.findByCredentialsAdmin = async (email, password, type) => {
    const admin = await Companies.findOne({email})
    console.log(admin)
    
    if(!admin) {
        throw Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, admin.password)
    if(!isMatch){
        throw Error('Unable to login')
    }
    
    if(admin.type === 'admin'){
        return admin
    }
}

companySchema.methods.generateAuthToken = async function() {
    const company = this;
    const token = jwt.sign({_id: company._id.toString(), companyName: company.companyName,
    owner: company.owner, email: company.email, description: company.description, type: company.type}, 'thisIsMySecretKey');

    company.tokens = company.tokens.concat({token})
    await company.save()
    return token
}

companySchema.methods.toJSON = function() {
    const company = this;
    const publiccompanyData = company.toObject()

    delete publiccompanyData.password
    delete publiccompanyData.tokens
    delete publiccompanyData.avatar

    console.log(publiccompanyData)
    return publiccompanyData
}



const Companies = mongoose.model('Companies', companySchema)

module.exports = Companies