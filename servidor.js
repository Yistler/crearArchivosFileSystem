const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const fs = require("fs").promises;

app.listen(3000, ()=>{
    console.log("Servidor corriendo en http://127.0.0.1:3000");
})

//configurando handlebars
app.set("view engine", "handlebars");
app.engine(
    "handlebars",
    exphbs.engine({
        //vistas
        layoutsDir: __dirname + "/views",
        //componentes
        partialsDir: __dirname + "/views/componentes",
    })
);

app.get("/", (req, res)=>{
    res.render("inicio", {
        layout: "inicio"
    })
})

//Crear un archivo
app.get("/crear", async (req, res)=>{
    const { archivo, contenido } = req.query
    const date = new Date().toLocaleDateString({
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
    try{
        await fs.writeFile(archivo, contenido)
        res.send(`Archivo creado ${date}`)
    }catch(err){
        res.status(500).send(`Algo salio mal: <br/> ${err}`)
    }
});

//leer un archivo
app.get("/leer", async (req, res)=>{
    const { archivo } = req.query
    try{
        const dato = await fs.readFile(archivo)
        res.send(dato);
    }catch(err){
        res.status(500).send(`Algo salio mal: <br/> ${err}`)
    }
});

//renombrar un archivo
app.get("/renombrar", async(req, res)=>{
    const { nombre, nuevoNombre } = req.query
    try{
        await fs.rename(nombre, nuevoNombre)
        res.send(`Archivo ${nombre} a sido renombrado por ${nuevoNombre} ${date}`)
    }catch(err){
    res.status(500).send(`Algo salio mal: <br/> ${err}`)
    }
});

//eliminar un archivo
app.get("/eliminar", async(req, res) =>{
    const { archivo } = req.query
    try{
        await fs.unlink(archivo)
        res.send("Archivo eliminado")
    }catch(err){
        res.status(500).send(`Algo salio mal: <br/> ${err}`)
    }        
});

app.get("*", (req, res)=>{
    res.sendStatus(404)
})