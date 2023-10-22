const contenedor = document.getElementById('conteiner');
    const jsonFilePath = '/api/products';
    const socket = io();

    const productForm = document.getElementById('productForm');

    // Maneja el envío del formulario para agregar producto
    productForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const title = document.getElementById('titleInput').value;
        const description = document.getElementById('descriptionInput').value;
        const price = document.getElementById('priceInput').value;
        const stock = document.getElementById('stockInput').value;
        const category = document.getElementById('categoryInput').value;

        const newProduct = {
            title,
            description,
            price,
            stock,
            category
        };

        // Envía el nuevo producto al servidor
        socket.emit('addProduct', newProduct);
    });

    // Escucha el evento de producto agregado y vuelve a cargar los productos
    socket.on('productAdded', ({ addedProduct }) => {
        console.log('Producto agregado:', addedProduct);
        // Vuelve a cargar los productos después de agregar uno nuevo
        cargarProductos();
    });

    const cargarProductos = () => {
        fetch(jsonFilePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al obtener el archivo JSON: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                const products = data.products;

                // Limpiar contenedor antes de volver a renderizar
                contenedor.innerHTML = '';

                // Itera sobre cada producto y renderiza la plantilla
                products.forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'col-md-3'; // Cada tarjeta ocupa 3 columnas en dispositivos medianos (md)
                    card.innerHTML = `
                      <div class="card mt-3" style="margin-bottom: 20px;">
                        <img src="${product.thumbnail || 'https://cdn.pixabay.com/photo/2017/01/25/17/35/picture-2008484_1280.png'}" class="card-img-top" alt="...">
                        <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">Descricion: ${product.description}</p>
                        <p class="card-text">Price: ${product.price}</p>
                        <p class="card-text">Stock: ${product.stock}</p>
                        <p class="card-text">Category: ${product.category}</p>
                        <a href="#" class="btn btn-primary" onclick='eliminarProducto("${product.id}")'>Eliminar producto</a>                      </div>
                    `;
                    contenedor.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

socket.on('deleteProduct', ({ productId }) => {
    try {
        console.log('Producto eliminado:', productId);
        cargarProductos();
    } catch (error) {
        console.error('Error al manejar evento "productDeleted":', error);
    }
});

const eliminarProducto = (productId) => {
    try {
        socket.emit('deleteProduct', { productId });
    } catch (error) {
        console.error('Error al intentar eliminar el producto:', error);
    }
};