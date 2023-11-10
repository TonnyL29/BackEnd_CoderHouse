import prodModel from '../models/product.model.js'

export default  class prodManager {


// prodManager.js

static async get(query = {}, page = 1, limit = 10) {
    const criteria = {};

    if (query.prod_id) {
        criteria.prod_id = query.prod_id;
    }

    let sortOptions = {}; // Opciones de ordenamiento por defecto (ningún ordenamiento)

    if (query.sort) {
        if (query.sort.toLowerCase() === 'desc') {
            sortOptions = { price: -1 }; // Orden descendente por precio
        } else if (query.sort.toLowerCase() === 'asc') {
            sortOptions = { price: 1 }; // Orden ascendente por precio
        }
    }

    const skip = (page - 1) * limit;

    const products = await prodModel.find(criteria).sort(sortOptions).skip(skip).limit(limit);

    // Calcular valores necesarios para la paginación
    const totalProducts = await prodModel.countDocuments(criteria);
    const totalPages = Math.ceil(totalProducts / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
        products,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage
    };
}



    static async create(data) {
        const prod = await prodModel.create(data);
        console.log('Producto creado correctamente');
        return prod;
    }

    static async getById(pid) {
        const prod = await prodModel.findById(pid);
        if (!prod) {
            throw new Error('No existe el producto');
        }
        return prod;
    }

    static async updateById(pid, data) {
        const prod = await prodModel.findById(pid);
        if(!prod){
            throw new Error ('No existe el producto');
        }
        const criteria = {prod_id : pid};
        const operation = {$set: data};
        await prodModel.updateOne(criteria, operation);
        console.log('Producto actualizado correctamente');
    }

    static async deleteById(sid) {
        try {
            const deletedProduct = await prodModel.findByIdAndDelete(sid);
    
            if (!deletedProduct) {
                throw new Error('No existe el producto');
            }
    
            console.log('Producto eliminado correctamente');
            return deletedProduct;
        } catch (error) {
            throw error;
        }
    }
    
}