import Gallery from '../models/gallery.model'
import errorHandler from '../helpers/dbErrorHandler'
import upload from '../middleware/upload'
import fs from 'fs'

const uploadPhoto = async (req, res, next) => {
    try {
        await upload(req, res)

        if (req.files.length <= 0) {
            return res.send(`You must select at least 1 file.`);
        }
      next();
    } catch (error) {
        console.log(error);
    
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
          return res.send("Too many files to upload.");
        }
        return res.send(`Error when trying upload many files: ${error}`);
      }
}

const savePhotoDB = async (req, res) => {

    try{
        let gallery = new Gallery(req.body)

        var finalImg = {}
        for (let i in req.files) {
            const file = req.files[i];
            // here you can call GridFS method and upload the file
             finalImg[i] = {
                data: fs.readFileSync(file.path),
                contentType : file.mimetype
            }
            gallery.photos.push(finalImg[i])
        }
        gallery.postedBy = req.profile

        let result = await gallery.save()
         res.status(200).json(result) 
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const listGallery = async (req, res) => {
    try {
        let gallery = await Gallery.find({})
                                    .populate('postedBy', '_id name')
                                    .sort('-created')
                                    .exec()
        
        res.json(gallery)
    }
    catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const galleryById = async (req, res, next, id) => {
    try{
        let gallery = await Gallery.findById(id).populate('postedBy', '_id name').exec()
    
        if(!gallery){
            return res.status('400').json({
                error: "Gallery not found"
            })
        }

        req.gallery = gallery

        next()
    }catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const photo = (req, res, next) =>{
    const id = req.params.photoId
    res.set("Content-Type", req.gallery.photos[id].contentType)
    return res.send(req.gallery.photos[id].data)
}

const viewGallery = (req, res) => {
    return res.json(req.gallery)
}
export default{
    uploadPhoto,
    savePhotoDB,
    listGallery,
    galleryById,
    photo,
    viewGallery
}