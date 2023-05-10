const express = require('express');
const cors = require('cors');
const path= require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT
const mime = require('mime-types');
const {create} = require('express-handlebars');
const routes = require('./routes/index');
const app = express();
 const indexRoutes = require('./routes/index')
const mongoose = require('mongoose');
const gatewa = require("../src/models/gatway");
const fetch = require('node-fetch');

app.use(express.json());
app.use(cors());
app.use(morgan(':method :url :status :user-agent - :response-time ms'));
app.use(bodyParser.json());
 
app.use('/', routes);
mime.contentType('text/css')
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://54.85.218.28:27017/gateway', { useNewUrlParser: true, useUnifiedTopology: true }, )
    .then(() => console.log('Conexión exitosa a MongoDB'))
    .catch((err) => console.error('Error al conectar a MongoDB:', err));
	
    

app.post('/prueba', (req, res) => {
  // Imprime el cuerpo de la solicitud POST
  const code = req.body.codigo;
 
  const destinatario= req.body.destinatario;
  //const namer = req.body.nombre

  console.log(req.body);

  // Envía una respuesta
  res.send('¡Solicitud POST recibida!');

  async function  prueba(codigo, destinatario){
    const userId = codigo;
    const Gatewar =  await gatewa.findOne({codigo: userId});

    console.log('LOS DATOS MAJE ' +  JSON.stringify(Gatewar)  )
    
    const texto = Gatewar.text;
    const conexion = Gatewar.conexion;
    const tipo =  Gatewar.tipo_envio;
    const url_imag  =  Gatewar.url_imagen


     if(tipo === "text"){
      
    setTimeout(function(){   
      const data = {
        'api_key':'JH5n8ZVh4LS9vEG5ThLXtA5qCztcra',
        'sender': '502' + conexion,
        'number': '502' + destinatario,
        'message': texto 
      };
      
      fetch('https://bot.watukan.com/send-message', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
        .then(response => response.json())
        .then(data => {
          console.log(data); // manejar la respuesta de la API
        })
        .catch(error => {
          console.error(error); // manejar el error
          res.send('NO SE PUDO ENVIAR' + error)
        });
      
      }, 1000);
  
  
    };
    if(tipo === "imgr"){
      setTimeout(function(){   
     //PARA ENVIAR VARIABLES
    //let variable = '*'+namer+'*';
    //let texto2 = texto.replace("{{nombre}}", variable);

        const data = {
          'api_key':'JH5n8ZVh4LS9vEG5ThLXtA5qCztcra',
          'sender': '502' + conexion,
          'number': '502' + destinatario,
          'message': texto,
          'url' : url_imag,
          'type' :'image'//Choose One
        };
        
        fetch('https://bot.watukan.com/send-media', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' },
        })
          .then(response => response.json())
          .then(data => {
            console.log(data); // manejar la respuesta de la API
          })
          .catch(error => {
            console.error(error); // manejar el error
            res.send('NO SE PUDO ENVIAR' + error)
          });
        
        }, 1000);
    
    
      };
    };
  prueba(code, destinatario)
    
     
     




  
});
	 // settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  create({
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    defaulLayout: "main",
    extname: ".hbs",
  }).engine
);
app.set("view engine", ".hbs");
app.use(indexRoutes);


// public route
app.use(express.static(path.join(__dirname, "public")));
 
app.listen(process.env.PORT || 3000, function() {
	console.log('App corriendo en puerto: ' + port)
});