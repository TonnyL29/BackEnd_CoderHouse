import cartrModel from '../models/cart.model.js';

export default class cartManager {
    static async get(query = {}) {
        try {
            const criteria = {};
            if (query.cart_id) {
                criteria.cart_id = query.cart_id;
            }
            const cart = await cartrModel.find(criteria).populate('product.prod_id');
            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            throw new Error('Error interno del servidor al obtener el carrito');
        }
    }

    static async create(productData) {
        try {
            const cart = await cartrModel.create({
                product: [productData],
                status: 'pending',
            });
            console.log('Carrito creado correctamente');
            return cart;
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            throw new Error('Error interno del servidor al crear el carrito');
        }
    }

    static async getById(cartId) {
        try {
            const cart = await cartrModel.findById(cartId).populate('product.prod_id');
            if (!cart) {
                throw new Error('No existe el carrito');
            }
            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito por ID:', error);
            throw new Error('Error interno del servidor al obtener el carrito por ID');
        }
    }

    static async updateCart(cartId, productData) {
        try {
            const cart = await cartrModel.findById(cartId);
            if (!cart) {
                throw new Error('No existe el carrito');
            }
            
            const existingProduct = cart.product.find(
                (p) => p.prod_id.toString() === productData.prod_id
            );

            if (existingProduct) {
                existingProduct.quantity += productData.quantity;
            } else {
                cart.product.push(productData);
            }

            await cart.save();
            console.log('Carrito actualizado correctamente');
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            throw new Error('Error interno del servidor al actualizar el carrito');
        }
    }

    static async removeProduct(cartId, productId) {
        try {
            const cart = await cartrModel.findById(cartId);
            if (!cart) {
                throw new Error('No existe el carrito');
            }

            cart.product = cart.product.filter((p) => p.prod_id.toString() !== productId);

            await cart.save();
            console.log('Producto eliminado del carrito correctamente');
            return cart;
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            throw new Error('Error interno del servidor al eliminar el producto del carrito');
        }
    }

    static async removeAllProducts(cartId) {
        try {
            const cart = await cartrModel.findById(cartId);
            if (!cart) {
                throw new Error('No existe el carrito');
            }

            cart.product = [];
            await cart.save();
            console.log('Todos los productos del carrito fueron eliminados correctamente');
        } catch (error) {
            console.error('Error al eliminar todos los productos del carrito:', error);
            throw new Error('Error interno del servidor al eliminar todos los productos del carrito');
        }
    }
}
