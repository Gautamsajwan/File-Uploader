import { Router } from 'express'
import upload from '../config/multer.js'
import cloudinary from '../config/cloudinary.js'
import fs from 'fs'
import Doc from '../models/DocsModel.js'

const router = Router()

router.post('/upload', async (req, res) => {
    try {
        upload.single('resume')(req, res, async (err) => { // this is done for handling multer errors
            console.log("upload started")
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'File upload failed',
                    error: err.message,
                });
            }
            
            console.log("file =>", req.file)

            const {originalname, mimetype, size, path} = req.file

            const options = {
                resource_type: "auto",
                allowed_formats: [
                    "pdf"
                ],
                folder: 'resume',
            }

            const result = await cloudinary.uploader.upload(path, options)
            if (!result.secure_url) {
                res.status(500).json({
                    success: false,
                    msg: 'Error uploading file to Cloudinary'
                });
                return;
            }

            const assetURL = result.secure_url
            const assetPublicId = result.public_id

            let uploadedDoc = await Doc.create({
                fileName: originalname,
                fileType: mimetype,
                fileSize: size,
                uploadTimeStamp: new Date(),
                storageLocation: path,
                assetURL: assetURL,
                assetPublicId: assetPublicId
            });

            fs.unlinkSync(path);

            res.status(200).json({
                success: true,
                msg: 'File uploaded successfully',
                resume: uploadedDoc
            });
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message,
        });
    }
});

router.post('/uploadMultiple', async (req, res) => {
    try {
        upload.array('resumes')(req, res, async (err) => { // this is done for handling multer errors
            console.log("upload started")
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'File upload failed',
                    error: err.message,
                });
            }
            
            console.log("files =>", req.files)
            const resumes = req.files

            try {
                const promises = resumes.map(async(resume) => {
                    const options = {
                        resource_type: "auto",
                        allowed_formats: [
                            "pdf"
                        ],
                        folder: 'resume',
                    }

                    const {originalname, mimetype, size, path} = resume
        
                    const result = await cloudinary.uploader.upload(path, options)
                    if (!result.secure_url) {
                        res.status(500).json({
                            success: false,
                            msg: 'Error uploading file to Cloudinary'
                        });
                        return;
                    }
        
                    const assetURL = result.secure_url
                    const assetPublicId = result.public_id
        
                    let uploadedDoc = await Doc.create({
                        fileName: originalname,
                        fileType: mimetype,
                        fileSize: size,
                        uploadTimeStamp: new Date(),
                        storageLocation: path,
                        assetURL: assetURL,
                        assetPublicId: assetPublicId
                    });
        
                    fs.unlinkSync(path);
                })

                const result = await Promise.all(promises)
                res.status(200).json({
                    success: true,
                    msg: 'Files uploaded successfully',
                });
            } catch (err) {
                console.error(err);
                res.status(500).send('Internal server error')
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message,
        });
    }
});

export default router