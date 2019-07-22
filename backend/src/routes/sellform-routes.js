// const express = require('express');
// const WishList = require('../models/wishlist');
// const SellForm = require('../models/sellform');
// const multer = require('multer');
// const sharp = require('sharp');
// const routes = express.Router();
// const auth = require('../middleware/auth');


// // const storage = multer.diskStorage({
// //     destination: function (req, file, cb) {
// //         cb(null, 'uploadsFolder')
// //     },
// //     filename: function(req, file, cb){
// //         const fileNameSplit = file.originalname.split('.');
// //         const fileExtension = fileNameSplit[fileNameSplit.length - 1];
// //         cb(null, Date.now() + '-' + Math.ceil(Math.random() * 1000) + '.' + fileExtension) 
// //     }
// // })

// const uploadImage = multer({
//     limits: {
//         // fileSize: 100000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|PNG|pdf)$/)) {
//             return cb(new Error('please upload an Image'))
//         }
//         cb(undefined, true)
//     }
// })

// routes.post('/sellform/uploadfile', uploadImage.array('images'), async (req, res) => {
//     // req.profile.avatar = req.file.buffer
//     // await req.profile.save()
//     // const files = req
//     // console.log(files, 'filess')
//     // const newImg = new SellForm({
//     //     images: req.file.path
//     // })
//     (req.files).map((b) => {
//         console.log(b.buffer, 'bb')
//     })
//     // console.log(req.files, 'img')
//     // const buffer = await sharp(req.files.buffer).resize({
//     //     width: 200,
//     //     height: 200
//     // }).png().toBuffer()

//     // req.body.images = buffer
//     // await newImg.save()
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })
// //create wish route
// routes.post('/sellform', auth, uploadImage.any('images'), async (req, res) => {
//     // console.log(req.files, 'req.body')
//     try {
//        const pictures = (req.files).map((b) => {
//             const buffer = sharp(b.buffer).resize({
//                 width: 200,
//                 height: 200
//             }).png().toBuffer()
//             console.log(buffer)
//             return buffer
//         })
//         const sell = new SellForm({
//             // productName: req.body.productName,
//             // description: req.body.description,
//             // price: req.body.price,
//             // category:  req.body.category,
//             images: pictures,
//             addedBy: req.profile._id
//         })
//         // console.log(pictures)
//         console.log(sell, 'sell server')
//         // await sell.save()
//         res.status(201).send('okay')
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

// routes.get('/sellform/images', auth, async (req, res) => {
//     console.log(req)
//     try {
//         const profile = req.profile
//         // if(!profile.avatar) {
//         //     throw new Error()
//         // }
//         res.set('Content-type', 'image/png')
//         // res.send(profile.avatar)
//     } catch (e) {
//         res.status(404).send('got it')
//     }
// })
// routes.get('/sellForm/', auth, async (req, res) => {
//     const _id = req.params.id
//     try {
//         // const wish = await WishList.findOne({
//         //     _id,
//         //     wishedBy: req.profile._id
//         // })

//         // const wishList = await req.profile.populate('wishList').execPopulate()
//         const { status, limit, skip, sortAt, order } = req.query
//         // console.log(typeof status, status, 'status');

//         const match = {}
//         if (status) {
//             match.status = (status) === "true"
//         }
//         const sort = {}
//         if (sortAt) {
//             sort[sortAt] = (order === 'desc') ? -1 : 1
//         }
//         const sellForm = await req.profile.populate({
//             path: 'sellForm',
//             match,
//             options: {
//                 limit: parseInt(limit),
//                 skip: parseInt(skip),
//                 sort
//             }
//         }).execPopulate()
//         if (!sellForm) {
//             res.status(404).send('No sellForm found!')
//         }

//         res.send(sellForm)

//     } catch (e) {
//         res.status(500).send(e)
//     }
// })

// module.exports = routes