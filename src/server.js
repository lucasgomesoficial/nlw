const express = require("express")
const server = express()

// configurando os caminhos
server.use(express.static("public"))


//utilizando templates engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})


// direcionando as páginas para o servidor
// req: requisição - res: resposta
server.get("/", (req, res) => {
    return res.render("index.html")
})

server.get("/create-point", (req, res) => {
    return res.render("create-point.html")
})

server.get("/search", (req, res) => {
    return res.render("search-results.html")
})



// ligar o servidor
server.listen(3000)