//Importamos express
const express = require("express");
const db = require("./utils/database"); //no lleva el .js
const initModels = require("./models/init.models");
const Users = require("./models/users.models");
const Todos = require("./models/todos.models");
const userRoutes = require("./routes/users.routes");
const todosRoutes = require("./routes/todos.routes");
const authRoutes = require('./routes/auth.routes');
const cors = require('cors');
require("dotenv").config();

console.log(process.env.PORT);

//Crear una instancia de express
const app = express();

app.use(express.json());
app.use(cors());

//Definimos el puerto
const PORT = process.env.PORT;

//Probando la conexión a la base de datos
db.authenticate()
  .then(() => console.log("Autenticación exitosa."))
  .catch((error) => console.log("Error: " + error));

initModels();
//vamos usar el método sync de nuestra db
db.sync({ force: false })
  .then(() => console.log("Base de datos sincronizada."))
  .catch((error) => console.log("Error: " + error));

//Definimos las rutas

//Definimos la ruta
app.get("/", (req, res) => {
  res.status(200).json({ message: "Bienvenido al servidor." });
});

app.use("/api/v1", userRoutes, todosRoutes, authRoutes);

//Definir las rutas de nuestros endpoints (de ahora en adelante ep)
//todas las consultas de usuarios
//localhost:8000/users --> todo para usuarios
//localhost:8000/todos --> todo para tareas

//GET a /users
app.get("/users", async (req, res) => {
  try {
    //Vamos a obtener el resultado de consultar a todos los usuarios de la DB
    const result = await Users.findAll(); //SELECT * FROM users;
    res.status(200).json(result);
  } catch (error) {
    console.log("Error: " + error);
  }
});

//Obtener un usuario sabiendo su ID
app.get("/users/:id", async (req, res) => {
  try {
    /* console.log(req.params); */
    /* res.send(" "); */
    const { id } = req.params;
    const result = await Users.findByPk(id);
    res.status(200).json(result);
  } catch (error) {
    console.log("Error: " + error);
  }
});

//Obtener un usuario por username
app.get("/users/username/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const result = await Users.findOne({ where: { username } }); //SELECT * FROM users WHERE username = jamirb
    res.status(200).json(result);
  } catch (error) {
    console.log("Error: " + error);
  }
});

//Creando un usuario
app.post("/users", async (req, res) => {
  try {
    const user = req.body;
    const result = await Users.create(user);
    res.status(201).json(result);
  } catch (error) {
    res.status(404).json(error.message);
    console.log("Error: " + error);
  }
});

//Actualizar un usuario, solo podemos cambiar password
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const field = req.body;
    const result = await Users.update(field, { where: { id } });
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

//Eliminar un usuario --> id
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Users.destroy({ where: { id } });
    res.status(200).json(result);

    //validar que el usuario no tenga tareas
    //si tiene tareas responder "no se puede eliminar"
    //si no tiene --> eliminarlo

  } catch (error) {
    res.status(404).json(error.message);
  }
});

/*------------------------------------------*/

//Obtener todas las tareas
app.get("/todos", async (req, res) => {
  try {
    const result = await Todos.findAll();
    res.status(200).json(result);
  } catch (error) {
    console.log("Error: " + error);
  }
});

//Obtener una tarea por su ID
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Todos.findByPk(id);
    res.status(200).json(result);
  }catch(error){
    res.status(404).json("No se encontró la tarea");
  }
});

//Crear un nuevo Todos
app.post("/todos", async (req, res) => {
  try {
    const todo = req.body;
    const result = await Todos.create(todo);
    res.status(201).json(result);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

//Actualizar un Todos
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const field = req.body;
    const result = await Todos.update(field, { where: { id } });
    res.status(200).json(result);
  }catch(error){
    res.status(404).json("No se encontró la tarea");
  }
});

//Eliminar un Todos
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Todos.destroy({ where: { id } });
    res.status(200).json(result);
  }catch(error){
    res.status(404).json("No se encontró la tarea");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
