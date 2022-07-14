//
const {Router} = require ('express')
const router = Router()
const multer = require('multer');
const fs = require('fs')
const path = require('path')
const sharp = require('sharp');


const URL = "http://localhost:3000/images/"
global.__basedir = __dirname;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        cb(null, `${Date.now()}.${ext}`)
    }

})

const upload = multer({ storage })
//Subir Imagen
router.post('/images', upload.single('file'), (req, res) => {
    res.send({ fileName: req.file.filename })
})
//Lista de imagenes con su direccion
router.get('/images', (req, res) => {
    let uploadsLocation = path.join(__dirname, '../..', "uploads")
    fs.readdir(uploadsLocation, function (err, files) {
        if (err) {
            res.status(500).send({
                message: 'no files :('
            })
        }
        else {
            let fileList = [];
            files.forEach((file) => {
                fileList.push({
                    name: file,
                    url: URL + file,
                })
            });
            res.status(200).send(fileList);
        }
    })
});
//obtener imagen por su nombre
router.get('/images/:name', (req, res) => {
    const fileName = req.params.name;
    let uploadsLocation = path.join(__dirname, '../..', "/uploads/");
    fs.readdir(uploadsLocation, function (err, files) {
        if (err) {
            res.status(500).send({
                message: 'no files :('
            })
        }
        else {
            let found = 0;
            files.forEach((file) => {
                if (file === fileName) {
                    found = 1;
                }
            });
            if (found > 0) {
                res.sendFile(uploadsLocation + fileName);
            }
            else {
                res.status(404).send({ message: "Error" })
            }
        }
    })
})
//eliminar imagen
router.delete('/images/:name/delete', (req, res) => {
    const fileName = req.params.name;
    let uploadsLocation = path.join(__dirname, '../..', "/uploads/");

    fs.rm(uploadsLocation + fileName, function (err) {
        if (err) {
            // res.status(500).send({ message: "no encontrado" })
        }
    });

    res.status(200).send({ message: 'Eliminado' })

})

module.exports = router