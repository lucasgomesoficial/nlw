const express = require("express")
const server = express()

// apontando o db "banco de dados"
const db = require("./database/db")

// configurando pasta pública
server.use(express.static("public"))

// habilitar req.body na aplicação
server.use(express.urlencoded({extended: true}))

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

server.post("/savepoint", (req, res) => {

    // req.body = corpo do form
    // console.log(req.body)

    // inserindo os dados
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            return res.render("create-point.html", {erro: true})
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", {saved: true})
    }

    db.run(query, values, afterInsertData)
})

server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == "") {
        // search vazio
        return res.render("search-results.html", {total: 0})
    }

    // resgatar os dados do db
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        const total = rows.length

        // console.log("Aqui estão seus registros: ")
        // console.log(rows)

        // os dados
        return res.render("search-results.html", {places: rows, total}) // {total: total}
    })
})



// ligar o servidor
server.listen(3000)