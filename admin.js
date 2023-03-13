const express = require("express")
const router = express.Router()
const db = require("./db")

const md5 = require("md5")
const Cryptr = require("cryptr")
const crypt = new Cryptr("987654321")

validateToken = () => {
    return (req, res, next) => {
        // cek keberadaan "Token" pada request header
        if (!req.get("Token")) {
            // jika "Token" tidak ada
            res.json({
                message: "Access Forbidden"
            })
        } else {
            // tampung nilai Token
            let token = req.get("Token")

            // decrypt token menjadi id_admin
            let decryptToken = crypt.decrypt(token)

            // sql cek id_user
            let sql = "select * from admin where ?"

            // set parameter
            let param = { id_admin: decryptToken }

            // run query
            db.query(sql, param, (error, result) => {
                if (error) throw error
                // cek keberadaan id_user
                if (result.length > 0) {
                    // id_user tersedia
                    next()
                } else {
                    // jika user tidak tersedia
                    res.json({
                        message: "Invalid Token"
                    })
                }
            })
        }

    }
}

// end-point akses data admin
router.get("/admin", (req, res) => {
    // create sql query
    let sql = "select * from admin"

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
                admin: result // isi data
            }
        }
        res.json(response) // send response
    })
})

// end-point akses data admin berdasarkan id_admin tertentu
router.get("/admin/:id", (req, res) => {
    let data = {
        id_admin: req.params.id
    }
    // create sql query
    let sql = "select * from admin where ?"

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
                admin: result // isi data
            }
        }
        res.json(response) // send response
    })
})


// end-point menyimpan data admin
router.post("/admin", (req, res) => {

    // prepare data
    let data = {
        nama_admin: req.body.nama_admin,
        username: req.body.username,
        password: md5(req.body.password)
    }

    // create sql query insert
    let sql = "insert into admin set ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data inserted"
            }
        }
        res.json(response) // send response
    })
})

// end-point menyimpan data admin
router.post("/admin/auth", (req, res) => {

    // prepare data
    let param = [
        req.body.username,
        md5(req.body.password)
    ]

    // create sql query insert
    let sql = "select * from admin where username = ? and password = ?"

    //run query
    db.query(sql, param, (error, result) => {
        if (error) throw error

        // cek jumlah data hasil query
        if (result.length > 0) {
            // user tersedia
            res.json({
                message: "Logged",
                token: crypt.encrypt(result[0].id_admin), // generate token
                data: result
            })
        } else {
            // user tidak tersedia
            res.json({
                message: "Invalid username/password"
            })
        }
    })
})

// end-point mengubah data admin
router.put("/admin/:id_admin", validateToken(), (req, res) => {

    // prepare data
    let data = [
        // data
        {
            nama_admin: req.body.nama_admin,
            username: req.body.username,
            password: md5(req, body.password)
        },

        // parameter (primary key)
        {
            id_admin: req.body.id_admin
        }
    ]

    // create sql query update
    let sql = "update admin set ? where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data updated"
            }
        }
        res.json(response) // send response
    })
})


// end-point menghapus data admin berdasarkan id_admin
router.delete("/admin/:id", validateToken(), (req, res) => {
    // prepare data
    let data = {
        id_admin: req.params.id
    }

    // create query sql delete
    let sql = "delete from admin where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data deleted"
            }
        }
        res.json(response) // send response
    })
})


module.exports = router