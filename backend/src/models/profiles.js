const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const profileSchema = new mongoose.Schema({
    name: {
        type: String
    },
    fatherName: {
        type: String
    },
    grNo: {
        type: Number,
        // min: 0
    },
    address: {
        type: String
    },
    mobileNo: {
        type: Number
    },
    gender: {
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

profileSchema.pre('save', async function(next){
    const profile = this // fun should not be arrow
    if(profile.isModified('password')) {
        profile.password = await bcrypt.hash(profile.password, 8)
    }
    next()
})

profileSchema.pre('remove', async function(next){
    const profile = this // fun should not be arrow
    
    // await WishList.deleteMany({
    //     wishedBy: profile._id
    // }) 
    
    // next()
})

profileSchema.pre('remove', async function(next){
    const profile = this // fun should not be arrow
    
    await SellForm.deleteMany({
        addedBy: profile._id
    }) 
    
    next()
})

profileSchema.statics.findByCredentials = async (email, password) => {
    const profile = await Profiles.findOne({email})
    
    if(!profile) {
        throw Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, profile.password)

    if(!isMatch){
        throw Error('Unable to login')
    }
    console.log()
    return profile
}

profileSchema.methods.generateAuthToken = async function() {
    const profile = this;
    const token = jwt.sign({_id: profile._id.toString(), email: profile.email, name: profile.name,
        fatherName: profile.fatherName, grNo: profile.grNo, 
        address: profile.address, mobileNo: profile.mobileNo, gender: profile.gender, type: profile.type} , process.env.JWT_SECRET);

    profile.tokens = profile.tokens.concat({token})
    await profile.save()
    return token
}

profileSchema.methods.toJSON = function() {
    const profile = this;
    const publicProfileData = profile.toObject()

    delete publicProfileData.password
    delete publicProfileData.tokens
    delete publicProfileData.avatar

    console.log(publicProfileData)
    return publicProfileData
}


const Profiles = mongoose.model('Profiles', profileSchema)

module.exports = Profiles