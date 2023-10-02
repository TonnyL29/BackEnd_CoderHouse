import { readFileSync, writeFileSync } from "fs";

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.productIdCounter = 1;
  }

  addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    // Cargar productos existentes desde el archivo
    const existingProducts = this.loadProducts();

    // Validar que no se repita el campo "code"
    if (existingProducts.some((p) => p.code === product.code)) {
      console.error("El código del producto ya existe.");
      return;
    }

    // Agregar el producto con un ID autoincrementable
    const newProduct = {
      ...product,
      id: this.productIdCounter++,
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
    }
  }

  updateProduct(id, updatedProduct) {
    const products = this.loadProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      // Actualizar el producto sin cambiar su ID
      updatedProduct.id = id;
      products[index] = updatedProduct;
      this.saveProducts(products);
      console.log("Producto actualizado:", updatedProduct);
    } else {
      console.error("Producto no encontrado.");
    }
  }

  deleteProduct(id) {
    const products = this.loadProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      // Eliminar el producto del arreglo
      const deletedProduct = products.splice(index, 1)[0];
      this.saveProducts(products);
      console.log("Producto eliminado:", deletedProduct);
    } else {
      console.error("Producto no encontrado.");
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