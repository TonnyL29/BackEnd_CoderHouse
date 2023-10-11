import { readFileSync, writeFileSync } from "fs";
import * as fs from 'fs';


class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.code ||
      !product.stock
    ) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    // Cargar productos existentes desde el archivo
    const existingProducts = this.loadProducts();

    const newProduct = {
      ...product,
    };
    existingProducts.push(newProduct);

    // Guardar el arreglo de productos en el archivo
    this.saveProducts(existingProducts);
    console.log("Producto agregado:", newProduct);
  }

  getProducts() {
    return this.loadProducts();
  }

  getProductById(id) {
    const products = this.loadProducts();
    const product = products.find((p) => p.id === id);
    if (product) {
      return product;
    } else {
      console.error("Producto no encontrado.");
      return null;
    }
  }

  updateProduct(id, updatedProduct) {
    const products = this.loadProducts();
    const index = products.findIndex((p) => p.id.toString() === id.toString());
    if (index !== -1) {
      updatedProduct.id = id;
      products[index] = updatedProduct;
      this.saveProducts(products);
      console.log("Producto actualizado:", updatedProduct);
      return true;
    } else {
      console.error("Producto no encontrado.");
      return false;
    }
  }

  deleteProduct(id) {
    const products = this.loadProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      const deletedProduct = products.splice(index, 1)[0];
      this.saveProducts(products);
      console.log("Producto eliminado:", deletedProduct);
      return deletedProduct;
    } else {
      console.error("Producto no encontrado.");
      return null;
    }
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe o hay un error al leerlo, retornamos un arreglo vacío
      return [];
    }
  }

  saveProducts(products) {
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
  }
}


export default ProductManager;