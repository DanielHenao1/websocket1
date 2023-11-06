const socketClient = io();

// // Con esto enviamos un mensaje al back
// socketClient.on("SaludoDesdeBack", (msg) => {
//   console.log(msg);

//   socketClient.emit("SaludoDesdeFront", "Hola desde el front");
// });

// // Con esto optenemos los elementos del HTML
// const form = document.getElementById("form");
// const inputName = document.getElementById("name");
// const inputPrice = document.getElementById("price");
// const products = document.getElementById("products");

// // Con esto enviamos los productos
// form.onsubmit = (e) => {
//   e.preventDefault();
//   const name = inputName.value;
//   const price = inputPrice.value;
//   const product = { name, price };
//   socketClient.emit("newProduct", product);
//   inputName.value = "";
//   inputPrice.value = "";
// };

// // Con esto optenemos los producto .on para escuchar
// socketClient.on("arrayProducts", (productsArray) => {
//   let infoProducts = "";
//   productsArray.forEach((p) => {
//     infoProducts += `${p.name} ${p.price} <br/>`;
//   });
//   products.innerHTML = infoProducts;
// });

// Con esto enviamos los productos
form.onsubmit = (e) => {
    e.preventDefault();
    const name = inputName.value;
    const price = inputPrice.value;
    const product = { name, price };
    socketClient.emit("newProduct", product);
    inputName.value = "";
    inputPrice.value = "";
  };