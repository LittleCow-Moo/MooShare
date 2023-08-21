require("dotenv").config()
const express = require("express")
const multer = require("multer")
const upload = multer({ dest: "uploads/" })
const fs = require("fs")
const ncr = require("ncr-decode")

const app = express()
const baselink = process.env.BaseLink

function generateID(length) {
  let result = ""
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-"
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  if (fs.existsSync(`files/${result}`)) {
    result = generateID(length)
  }
  return result
}

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
  var folderid = generateID(5)
  fs.mkdirSync("files/" + folderid, { recursive: true })
  req.files.forEach((file) => {
    fs.renameSync(
      file.path,
      "files/" + folderid + "/" + ncr.decode(file.originalname)
    )
  })
  const filelink =
    req.files.length != 1
      ? baselink + "/d/" + folderid
      : req.query.sharex != "1"
      ? baselink + "/d/" + folderid + "/" + req.files[0].originalname
      : baselink + "/s/" + folderid + "/" + req.files[0].originalname
  if (req.query.sharex == "1") return res.send(filelink)
  res.send(
    fs.readFileSync("link.html").toString().replaceAll("{link}", filelink)
  )
})
app.get("/d/:id/:name", (req, res) => {
  const filepath = __dirname + "/files/" + req.params.id + "/" + req.params.name
  if (!fs.existsSync(filepath))
    return res.status(404).sendFile("404.html", { root: __dirname })
  res.download(filepath)
})
app.get("/s/:id/:name", (req, res) => {
  const filepath = __dirname + "/files/" + req.params.id + "/" + req.params.name
  if (!fs.existsSync(filepath))
    return res.status(404).sendFile("404.html", { root: __dirname })
  res.sendFile(filepath)
})
app.get("/d/:id", (req, res) => {
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
  if (req.path.startsWith("/download/")) {
    // old link redirect
    res.redirect(req.path.replace("/download/", "/d/"))
  }
  res.status(404).sendFile("404.html", { root: __dirname })
})
app.listen(process.env.Port)
