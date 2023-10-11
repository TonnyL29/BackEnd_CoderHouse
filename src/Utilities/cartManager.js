import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class CartManager {
    constructor(filePath) {
        this.path = filePath;
    }

    createNewCart() {
        const newCart = {
            id: uuidv4(), // Generar un nuevo ID único para el carrito
            products: [],
        };

        this.saveCart(newCart);
        console.log("Nuevo carrito creado:", newCart);

        return newCart;
    }

    addProductToCart(cartId, productId, quantity) {
        // Leer el carrito existente desde el archivo
        const existingCart = this.loadCart(cartId);

        // Verificar si el producto ya está en el carrito
        const existingProductIndex = existingCart.products.findIndex(p => p.productId === productId);

        if (existingProductIndex !== -1) {
            // Si el producto ya está en el carrito, incrementar la cantidad
            existingCart.products[existingProductIndex].quantity += quantity;
        } else {
            // Si el producto no está en el carrito, agregarlo
            const newProduct = {
                'productId': productId,
                'quantity': quantity,
            };
            existingCart.products.push(newProduct);
            console.log("Producto agregado al carrito:", newProduct);
        }

        // Guardar el carrito actualizado en el archivo
        this.saveCart(existingCart);

        // Devolver el carrito actualizado
        return existingCart;
    }

    loadCart(cartId) {
        try {
            // Intentar leer el archivo y parsear su contenido
            const data = fs.readFileSync(this.path, 'utf8');
            const carts = JSON.parse(data).carts || [];

            // Buscar el carrito por su ID
            const cart = carts.find(c => c.id === cartId);

            // Si se encuentra el carrito, devolverlo
            if (cart) {
                return cart;
            } else {
                // Si no se encuentra el carrito, devolver un nuevo carrito vacío
                return this.createNewCart();
            }
        } catch (error) {
            // Si hay un error al leer o parsear, devolver un carrito nuevo vacío
            return this.createNewCart();
        }
    }

    saveCart(cart) {
        try {
            // Intentar leer el archivo y parsear su contenido
            const data = fs.readFileSync(this.path, 'utf8');
            const carts = JSON.parse(data).carts || [];

            // Buscar y reemplazar el carrito existente con el mismo ID
            const existingCartIndex = carts.findIndex(c => c.id === cart.id);
            if (existingCartIndex !== -1) {
                carts[existingCartIndex] = cart;
            } else {
                // Si no se encuentra, agregar el nuevo carrito
                carts.push(cart);
            }

            // Guardar la lista actualizada de carritos en el archivo
            fs.writeFileSync(this.path, JSON.stringify({ carts }, null, 2));
        } catch (error) {
            // Si hay un error al leer o parsear, guardar el carrito como único en el archivo
            fs.writeFileSync(this.path, JSON.stringify({ carts: [cart] }, null, 2));
        }
    }
}

export default CartManager;



