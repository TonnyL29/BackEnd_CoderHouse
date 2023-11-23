let div_render = document.getElementById("productos_render");
let ulCart = document.getElementById("ul-toggle");

window.remove = (a, b) => {
  let URL = `carts/${a}/products/${b}`;

  fetch(URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((cartEdit) => {
      //console.log('Producto eliminado del carrito correctamente:', cartEdit);
      renderCart(cartEdit.updatedCart._id);
    })
    .catch((error) => {
      console.error("Error en la solicitud:", error);
    });
};

window.renderCart = (a) => {
  const cartId = a;
  const apiUrlCart = `carts/${cartId}`;
  const apiUrlProduct = "product/";
  let cartProduct = [];
  let data = [];
  let total = 0;

  fetch(apiUrlCart)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((cart) => {
      // console.log('Carrito obtenido:', cart);
      cartProduct.push(cart);
      const productPromises = cart.product.map((product) => {
        return fetch(`${apiUrlProduct}${product.prod_id}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((productData) => {
            data.push(productData);
            //console.log('Producto obtenido:', productData);
          });
      });
      return Promise.all(productPromises);
    })
    .then(() => {
      //console.log(cartProduct);
      let ulCart = document.getElementById("ul-toggle");
      ulCart.innerHTML = "";
      for (let i = 0; i < data.length; i++) {
        //console.log(data[i].product)
        total += data[i].product.price;
        ulCart.innerHTML += `<li class="nav-item p-2">
            <div class="d-flex">
            <img src="${data[i].product.thumbnail}" alt="Descripción de la imagen" class="img-fluid rounded overflow-hidden" style="width: 50px; height: 50px;">
            <div class="ms-3">
                <h5>${data[i].product.title}</h5>
                <p>${data[i].product.description}</p>
                <p>Cantidad: ${cartProduct[0].product[i].quantity}</p>
                <p>Precio: $ ${data[i].product.price}</p>
            </div>
            </div>
            <button class="btn btn-primary mb-3" type="button" onclick="remove('${cartProduct[0]._id}','${data[i].product._id}')">Eliminar producto</button>
            </li>`;
      }
    })
    .catch((error) => {
      console.error("Error en la solicitud:", error);
    });
};

let cart = localStorage.getItem("cartID");

window.addCart = (a) => {
  let cartId = localStorage.getItem("cartID");

  if (cartId === null) {
    const url = "addcart";
    const productData = {
      prod_id: a,
      quantity: 1,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("cartID", data.cart_id);
        renderCart(data.cart_id);
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
      });
  } else {
    const url = `carts/${cartId}`;
    const productData = {
      prod_id: a,
      quantity: 1,
    };

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        renderCart(cartId);
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
      });
  }
};

const ask_product = async (URL) => {
  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    //console.log(data);
    return data;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const render = async (a) => {
  div_render.innerHTML = "";
  let URL = "";
  if (a == "") {
    URL = "products";
  } else {
    URL = a;
  }
  let data = await ask_product(URL);
  for (let x = 0; x < data.payload.length; x++) {
    div_render.innerHTML += `<div class="card col-md-4 m-3" style="width: 18rem;">
        <img src="${data.payload[x].thumbnail}" class="card-img-top img-fluid mx-auto d-block mt-4" alt="..." style="width: 120px; height: 120px; object-fit: contain;">
        <div class="card-body text-center">
          <h5 class="card-title">${data.payload[x].title}</h5>
          <p class="card-text">${data.payload[x].description}</p>
          <button onclick="addCart('${data.payload[x]._id}')" id="btn_addCart" class="btn btn-primary">Agregar al carrito</button>
        </div>
      </div>`;
  }
};

if (cart != null) {
  renderCart(cart);
}

const logoutbtn = document.getElementById("logout");

logoutbtn.addEventListener("click", async () => {
  console.log("Logout button clicked"); // Añade este log para debug
  const url = "logout";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if(data.statusLogout){
      window.location.href = '../api/';
    }
})

let params = "";
render(params);