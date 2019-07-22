const jwt = require('jsonwebtoken');
const Profile = require('../models/profiles');
const Companies = require('../models/companyform');

const authProfile = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
        const profile = await Profile.findOne({ _id: decoded_token._id, 'tokens.token': token })
        if (!profile) {
            throw new Error()
        }
        req.token = token
        req.profile = profile

        next()
    } catch (e) {
        res.status(401).send({ error: 'please login first.' })
    }
}

const authCompany = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
        const company = await Companies.findOne({ _id: decoded_token._id, 'tokens.token': token })
        if (!company) {
            throw new Error()
        }
        req.token = token
        req.company = company

        next()
    } catch (e) {
        res.status(401).send({ error: 'please login first.' })
    }
}

module.exports = {
    authProfile,
    authCompany
}

// exports.authProfile = authProfile;
// exports.authCompany = authCompany