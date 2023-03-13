// inisiasi library
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const siswaroute = require("./siswa")
const bukuroute = require("./buku")
const adminroute = require("./admin")
const peminjaman_buku = require("./peminjaman_buku")

// implementation
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(siswaroute)
app.use(bukuroute)
app.use(adminroute)
app.use(peminjaman_buku)






//<................................................................buku.........................................................................>


app.listen(2000, () => {
    console.log("Run on port 2000")
})

