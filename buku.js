const express = require("express")
const db = require("./db")
const router = express.Router()

const multer = require("multer")
const path = require("path")
const fs = require("fs")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //set file storage
        cb(null, './image');
    },
    filename: (req, file, cb) => {
        //generate file name
        cb(null, "image-" + Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({ storage: storage })

// end-point akses data buku
router.get("/buku", (req, res) => {
    // create sql query
    let sql = "select * from buku"

    // run query
    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                count: result.length, // jumlah data
                buku: result // isi data
            }
        }
        res.json(response) // send response
    })
})

// end-point akses data buku berdasarkan id_buku tertentu
router.get("/buku/:id_buku", (req, res) => {
    let data = {
        id_buku: req.params.id_buku
    }
    // create sql query
    let sql = "select * from buku where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                count: result.length, // jumlah data
                buku: result // isi data
            }
        }
        res.json(response) // send response
    })
})


// end-point menyimpan data siswa
router.post("/buku", upload.single("image"), (req, res) => {

    // prepare data
    let data = {
        judul_buku: req.body.judul_buku,
        jual_hal_buku: req.body.jual_hal_buku,
        keterangan_kondisi_buku: req.body.keterangan_kondisi_buku,
        image: req.file.filename
    }

    if (!req.file) {
        //jika tidak file yang diupload
        res.json({
            message: "Tidak ada file yang dikirim"
        })
    } else {
        //create sql query insert
        let sql = "insert into buku set?"

        //run query
        db.query(sql, data, (error, result) => {
            if (error) throw error
            res.json({
                message: result.affectedRows + " data inserted"

            })
        })
    }
})


// end-point mengubah data siswa
router.put("/buku/:id_buku", upload.single("image"), (req, res) => {
    let data = null, sql = null
    let param = { id_buku: req.body.id_buku }

    if (!req.file) {
        data = {
            judul_buku: req.body.judul_buku,
            jual_hal_buku: req.body.jual_hal_buku,
            keterangan_kondisi_buku: req.body.keterangan_kondisi_buku,
        }
    } else {
        data = {
            judul_buku: req.body.judul_buku,
            jual_hal_buku: req.body.jual_hal_buku,
            keterangan_kondisi_buku: req.body.keterangan_kondisi_buku,
            image: req.file.filename
        }

        sql = "select * from perpustakaan where ?"

        //run query
        db.query(sql, param, (err, result) => {
            if (err) throw err
            //tampung nama file
            let fileName = result[0].image

            //hapus file lama
            let dir = path.join(__dirname, "image", fileName)
            fs.unlink(dir, (error) => { })
        })
    }

    //create sql update
    sql = "update perpustakaan set ? where ?"

    db.query(sql, [data, param], (error, result) => {
        if (error) {
            res.json({
                message: error.message

            })
        } else {
            res.json({
                message: result.affectedRows + " data updated"

            })
        }
    })
})


// end-point menghapus data siswa berdasarkan id_buku
router.delete("/buku/:id_buku", (req, res) => {
    // prepare data
    let param = {
        id_buku: req.params.id_buku
    }

    // create query sql delete
    let sql = "delete from buku where ?"

    // run query
    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({
                message: error.message
            })
        } else {
            res.json({
                message: result.affectedRows + "data deleted"
            })
        }

    })
})

module.exports = router