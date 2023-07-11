require("dotenv").config()
const express = require("express")
const multer = require("multer")
const upload = multer({ dest: "uploads/" })
const fs = require("fs")
const uuid = require("uuid").v4
const ncr = require("ncr-decode")

const app = express()
const baselink = process.env.BaseLink

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname })
})
app.get("/style.css", (req, res) => {
  res.sendFile("style.css", { root: __dirname })
})
app.get("/favicon.ico", (req, res) => {
  res.sendFile("favicon.ico", { root: __dirname })
})
app.post("/upload", upload.array("files"), (req, res) => {
  const folderid = String(
    parseInt(uuid().replaceAll("-", ""), 16) / 10000000000000000000000
  )
  fs.mkdirSync("files/" + folderid, { recursive: true })
  req.files.forEach((file) => {
    fs.renameSync(
      file.path,
      "files/" + folderid + "/" + ncr.decode(file.originalname)
    )
  })
  const filelink =
    req.files.length != 1
      ? baselink + "/download/" + folderid
      : baselink + "/download/" + folderid + "/" + req.files[0].originalname
  if (req.query.sharex == "1") return res.send(filelink + "?sharex=1")
  res.send(
    fs.readFileSync("link.html").toString().replaceAll("{link}", filelink)
  )
})
app.get("/download/:id/:name", (req, res) => {
  const filepath = __dirname + "/files/" + req.params.id + "/" + req.params.name
  if (!fs.existsSync(filepath))
    return res.status(404).sendFile("404.html", { root: __dirname })
  if (req.query.sharex == "1") return res.sendFile(filepath)
  res.download(filepath)
})
app.get("/download/:id", (req, res) => {
  if (!fs.existsSync("files/" + req.params.id))
    return res.status(404).sendFile("404.html", { root: __dirname })
  let linklist = []
  fs.readdirSync("files/" + req.params.id).forEach((file) => {
    linklist.push(
      '<a href="./' + req.params.id + "/" + file + '">' + file + "</a>"
    )
  })
  res.send(
    fs
      .readFileSync("folder.html")
      .toString()
      .replace("{content}", linklist.join(""))
  )
})
app.use((req, res) => {
  res.status(404).sendFile("404.html", { root: __dirname })
})
app.listen(process.env.Port)
