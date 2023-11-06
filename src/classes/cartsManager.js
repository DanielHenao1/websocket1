import fs from "fs/promises";

class CartsManager {
  constructor(cartsFile, productsFile) {
    this.cartsFile = cartsFile;
    this.productsFile = productsFile;
  }

  async initialize() {
    try {
      await fs.access(this.cartsFile);
    } catch (error) {
      await fs.writeFile(this.cartsFile, "[]", "utf8");
    }
  }

  generateUniqueCartId(carts) {
    let uniqueId;
    let isDuplicate;

    do {
      uniqueId = Math.floor(Math.random() * 1000000).toString();
      isDuplicate = carts.some((cart) => cart.id === uniqueId);
    } while (isDuplicate);

    return uniqueId;
  }

  async createCart() {
    try {
      const data = await fs.readFile(this.cartsFile, "utf8");
      const carts = JSON.parse(data);

      const newCartId = this.generateUniqueCartId(carts);

      const newCart = {
        id: newCartId,
        products: [],
      };

      carts.push(newCart);

      await fs.writeFile(
        this.cartsFile,
        JSON.stringify(carts, null, 2),
        "utf8"
      );

      return newCart;
    } catch (error) {
      throw new Error("Error al crear el carrito");
    }
  }

  async getCart(cartId) {
    try {
      const data = await fs.readFile(this.cartsFile, "utf8");
      const carts = JSON.parse(data);

      const cart = carts.find((c) => c.id === cartId);

      if (cart) {
        return cart.products;
      } else {
        throw new Error("Carrito no encontrado");
      }
    } catch (error) {
      throw new Error("Error al obtener el carrito");
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const data = await fs.readFile(this.cartsFile, "utf8");
      const carts = JSON.parse(data);

      const cart = carts.find((c) => c.id === cartId);

      if (cart) {
        const productsData = await fs.readFile(this.productsFile, "utf8");
        const products = JSON.parse(productsData);

        const product = products.find((p) => p.id == productId);

        if (product) {
          const existingProduct = cart.products.find(
            (p) => p.product === productId
          );

          if (existingProduct) {
            existingProduct.quantity += quantity;
          } else {
            cart.products.push({
              title: product.title,
              product: productId,
              quantity: quantity,
            });
          }

          await fs.writeFile(
            this.cartsFile,
            JSON.stringify(carts, null, 2),
            "utf8"
          );

          return cart;
        } else {
          throw new Error("Producto no encontrado");
        }
      } else {
        throw new Error("Carrito no encontrado");
      }
    } catch (error) {
      throw new Error("Error al agregar el producto al carrito");
    }
  }
}

export default CartsManager;
