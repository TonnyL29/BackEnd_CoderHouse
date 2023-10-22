import * as fs from 'fs';
import {v4 as uuiav4} from 'uuid'


class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.stock
    ) {
      console.error("Todos los campos son obligatorios.");
      return null; // Retorna null para indicar que hubo un error al agregar el producto
    }

    try {
      // Cargar productos existentes desde el archivo
      const existingProducts = this.loadProducts();

      const newProduct = {
        id: product.id || uuiav4(), // Asigna un nuevo ID si no se proporciona
        ...product,
      };

      existingProducts.push(newProduct);

      // Guardar el arreglo de productos en el archivo
      this.saveProducts(existingProducts);
      console.log("Producto agregado:", newProduct);

      return newProduct; // Retorna el nuevo producto agregado
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      return null; // Retorna null en caso de error
    }
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