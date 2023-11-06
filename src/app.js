import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import fs from "fs";

const app = express();
const port = 8081;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// Settiamos el motor de plantilla
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("/", (req, res) => {
  res.render("home");
});

// Ruta para la vista en tiempo real
app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

// Con esto creamos el servidor http express
const htttpServer = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// creamos el servidor websocket
const socketServer = new Server(htttpServer);

// Con esto creamos un array vacio
const products = [
  { name: "Producto 1", price: 10 },
  { name: "Producto 2", price: 20 },
  { name: "Producto 3", price: 30 },
];

// Con esto optenemos los elementos del HTML
socketServer.on("connection", (socket) => {
  console.log(`Usuario conectado ${socket.id}`);
  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });

  // Con esto enviamos un mensaje al cliente
  socket.emit("SaludoDesdeBack", "Bienvenido a websocket");

  // Con esto optenemos los elementos del HTML
  socket.on("SaludoDesdeFront", (msg) => {
    console.log(msg);
  });
  socket.on("newProduct", (product) => {
    products.push(product);
    socketServer.emit("arrayProducts", products);
  });
});
