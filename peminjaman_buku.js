const express = require("express")
const router = express.Router()
const db = require("./db")
const moment = require("moment")

// end-point menambahkan data peminjaman buku 
router.post("/peminjaman_buku", (req, res) => {
    // prepare data to peminjaman_buku
    let data = { //let=tipe data

        tanggal_pinjam: moment().format('YYYY-MM-DD HH:mm:ss'),
        id_admin: req.body.id_admin,
        id_siswa: req.body.id_siswa,//depan sesuai data base
        tanggal_kembali: req.body.tanggal_kembali, // get current time
        denda: req.body.denda
    }

    // parse to JSON


    // create query insert to peminjaman_buku
    let sql = "insert into peminjaman_buku set ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null

        if (error) {
            res.json({ message: error.message })
        } else {

            let buku = JSON.parse(req.body.buku)//parse digunakan menangkan JSON //JSON=nama file==mengubah tipe data

            // get last inserted id_peminjaman_buku
            let lastID = result.insertId

            // prepare data to detail_peminjaman_buku
            let data = []
            for (let index = 0; index < buku.length; index++) { //pelangggaran.length untuk mengitung panjangnya data di array
                data.push([
                    lastID, buku[index].id_buku
                ])
            }

            // create query insert detail_peminjaman_buku
            let sql = "insert into detail_peminjaman_buku values?"

            db.query(sql, [data], (error, result) => {
                if (error) {
                    res.json({ message: error.message })
                } else {
                    res.json({ message: "Data has been inserted" })
                }
            })
        }
    })
})

// end-point menampilkan data peminjaman buku
router.get("/peminjaman_buku", (req, res) => {
    // create sql query
    let sql = "select p.id_peminjaman_buku, p.tanggal_pinjam, p.id_siswa, p.id_admin, p.tanggal_kembali, p.denda, a.id_admin, a.nama_admin, a.status, s.id_siswa, s.nama_siswa from peminjaman_buku p join dataadmin a on p.id_admin = a.id_admin join datasiswa s on p.id_siswa = s.id_siswa"

    // run query
    db.query(sql, (error, result) => {
        if (error) {
            res.json({ message: error.message })
        } else {
            res.json({
                count: result.length,
                peminjaman_buku: result
            })
        }
    })
})

// end-point untuk menampilkan detail peminjaman_buku
router.get("/peminjaman_buku/:id_peminjaman_buku", (req, res) => {
    let param = { id_peminjaman_buku: req.params.id_peminjaman_buku }

    // create sql query
    let sql = "select p.judul_buku, p.jmlh_hal_buku " +
        "from detail_peminjaman_buku dps join databuku p " +
        "on p.id_buku = dps.id_buku " +
        "where ?"

    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({ message: error.message })
        } else {
            res.json({
                count: result.length,
                detail_peminjaman_buku: result
            })
        }
    })
})

// end-point untuk menghapus data peminjaman_buku
router.delete("/peminjaman_buku/:id_peminjaman_buku", (req, res) => {
    let param = { id_peminjaman_buku: req.params.id_peminjaman_buku }

    // create sql query delete detail_pelanggaran
    let sql = "delete from detail_peminjaman_buku where ?"

    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({ message: error.message })
        } else {
            let param = { id_peminjaman_buku: req.params.id_peminjaman_buku }
            // create sql query delete peminjaman_buku
            let sql = "delete from peminjaman_buku where ?"

            db.query(sql, param, (error, result) => {
                if (error) {
                    res.json({ message: error.message })
                } else {
                    res.json({ message: "Data has been deleted" })
                }
            })
        }
    })

})

module.exports = router