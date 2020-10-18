import express from 'express'
import galleryCtrl from '../controllers/gallery.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.param('galleryId', galleryCtrl.galleryById)

router.route('/api/uploadPhoto')
    .post(authCtrl.requireSignin ,galleryCtrl.uploadPhoto, galleryCtrl.savePhotoDB)

router.route('/api/listgallery')
    .get(galleryCtrl.listGallery)

router.route('/api/gallery/photo/:galleryId/:photoId')
    .get(galleryCtrl.photo)

router.route('/api/gallery/view/:galleryId')
    .get(galleryCtrl.viewGallery)
    
export default router