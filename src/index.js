const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.PORT;
const mime = require("mime-types");
const { create } = require("express-handlebars");
const routes = require("./routes/index");
const app = express();
const indexRoutes = require("./routes/index");
const mongoose = require("mongoose");
const gatewa = require("../src/models/gatway");
const fetch = require("node-fetch");
const jsoncreate = require("../src/models/createjson");

app.use(express.json());
app.use(cors());
app.use(morgan(":method :url :status :user-agent - :response-time ms"));
app.use(bodyParser.json());

app.use("/", routes);
mime.contentType("text/css");
app.use(express.urlencoded({ extended: true }));

const mongo_host = process.env.MONGO_HOST;
const mongo_port = process.env.MONGO_PORT;
const mongo_username = process.env.MONGO_USERNAME;
const mongo_password = process.env.MONGO_PASSWORD;
const mongo_db = process.env.MONGO_DB;
console.log(mongo_host);

mongoose
  .connect(
    `mongodb://${mongo_username}:${mongo_password}@${mongo_host}:${mongo_port}/${mongo_db}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Conexión exitosa a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

async function gate() {
  const Gateware = await gatewa.find();

  console.log(Gateware);
}
gate();

app.post("/api-envio", (req, res) => {
  try {
    // Imprime el cuerpo de la solicitud POST
    const code = req.body.codigo;

    const destinatario = req.body.destinatario;
    //const namer = req.body.nombre

    console.log(req.body);
    console.log(code, destinatario);
    // Envía una respuesta

    async function prueba(codigo, destinatario) {
      try {
        const userId = codigo;
        const Gatewar = await gatewa.findOne({ codigo: userId });

        console.log(Gatewar);

        const texto = Gatewar.text;
        const instancia = Gatewar.instancia;
        const apiKeys = Gatewar.apikeys;
        const conexion = Gatewar.conexion;
        const tipo = Gatewar.tipo_envio;
        const instancia_id = Gatewar.url_api;
        const url_api_text =
          "https://api.ultramsg.com/" + instancia_id + "/messages/chat";
        const url_api_img =
          "https://api.ultramsg.com/" + instancia_id + "/messages/image";
        const url_imag = Gatewar.url_imagen;

        try {
        } catch (error) {
          res.send("Ups... error");
        }

        if (tipo === "text") {
          setTimeout(function () {
            const data = {
              token: apiKeys,
              to: destinatario,
              body: texto,
            };

            fetch(url_api_text, {
              method: "POST",
              body: JSON.stringify(data),
              headers: { "Content-Type": "application/json" },
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data); // manejar la respuesta de la API
              })
              .catch((error) => {
                console.log(data);
                console.error("NO SE PUDO ENVIAR", error); // manejar el error
                // No envíes otra respuesta al cliente aquí
                // res.send("NO SE PUDO ENVIAR" + error);
              });
          }, 500);
        }
        if (tipo === "imgr") {
          setTimeout(function () {
            //PARA ENVIAR VARIABLES
            //let variable = '*'+namer+'*';
            //let texto2 = texto.replace("{{nombre}}", variable);

            const data = {
              token: apiKeys,
              to: destinatario,
              caption: texto,
              image: url_imag,
            };
            console.log(data);

            fetch(url_api_img, {
              method: "POST",
              body: JSON.stringify(data),
              headers: { "Content-Type": "application/json" },
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data); // manejar la respuesta de la API
              })
              .catch((error) => {
                console.log(data);
                console.error("NO SE PUDO ENVIAR", error); // manejar el error
                // No envíes otra respuesta al cliente aquí
                // res.send("NO SE PUDO ENVIAR" + error);
              });
          }, 500);
        }

        res.send("¡Solicitud POST recibida!");
      } catch (error) {
        // Manejo del error
        console.error("Ocurrió un error:", error);
      }
    }
    try {
      prueba(code, destinatario);
    } catch (error) {
      console.log("no se pudo ejecutar: " + error);
    }
  } catch (error) {
    console.log("un error");
  }
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

app.listen(process.env.PORT || 3331, function () {
  console.log("App corriendo en puerto: " + port);
});
