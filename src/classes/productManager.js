import fs from "fs/promises";

class ProductManager {
  constructor(productsFile) {
    this.productsFile = productsFile;
  }

  async initialize() {
    try {
      await fs.access(this.productsFile);
    } catch (error) {
      await fs.writeFile(this.productsFile, "[]", "utf8");
    }
  }

  async getProducts(limit) {
    const data = await fs.readFile(this.productsFile, "utf8");
    const products = JSON.parse(data);

    if (limit) {
      return products.slice(0, parseInt(limit, 10));
    } else {
      return products;
    }
  }

  async getProductById(id) {
    const data = await fs.readFile(this.productsFile, "utf8");
    const products = JSON.parse(data);

    const product = products.find((p) => p.id == id);

    if (product) {
      return product;
    } else {
      throw new Error("Producto no encontrado");
    }
  }

  async isProductCodeUnique(code) {
    const data = await fs.readFile(this.productsFile, "utf8");
    const products = JSON.parse(data);

    return !products.some((product) => product.code === code);
  }

  async addProduct(newProductData) {
    const data = await fs.readFile(this.productsFile, "utf8");
    const products = JSON.parse(data);

    // Verificar si el código es único
    if (await this.isProductCodeUnique(newProductData.code)) {
      const newProductId = products.length + 1;
      const newProduct = {
        id: newProductId,
        ...newProductData,
      };

      products.push(newProduct);

      await fs.writeFile(
        this.productsFile,
        JSON.stringify(products, null, 2),
        "utf8"
      );

      return newProduct;
    } else {
      throw new Error("El código de producto ya existe.");
    }
  }

  async updateProduct(id, updatedProductData) {
    const data = await fs.readFile(this.productsFile, "utf8");
    const products = JSON.parse(data);

    const productIndex = products.findIndex((p) => p.id == id);

    if (productIndex === -1) {
      throw new Error("Producto no encontrado");
    }

    updatedProductData.id = id;

    products[productIndex] = updatedProductData;

    await fs.writeFile(
      this.productsFile,
      JSON.stringify(products, null, 2),
      "utf8"
    );

    return updatedProductData;
  }

  async deleteProduct(id) {
    const data = await fs.readFile(this.productsFile, "utf8");
    const products = JSON.parse(data);

    const productIndex = products.findIndex((p) => p.id == id);

    if (productIndex === -1) {
      throw new Error("Producto no encontrado");
    }

    products.splice(productIndex, 1);

    await fs.writeFile(
      this.productsFile,
      JSON.stringify(products, null, 2),
      "utf8"
    );
  }
}

export default ProductManager;
