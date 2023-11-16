let div_render = document.getElementById("productos_render");
let div_toggle_bar = document.getElementById("ul-toggle");

{
  /* <li class="nav-item">
<a class="nav-link active" aria-current="page" href="#">Home</a>
</li> */
}



window.renderCart = (a) =>{
  const cartId = a;
  const apiUrl = `carts/${cartId}`;

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(cart => {
    console.log('Carrito obtenido:', cart);

    for (let x = 0; x < cart.product.length; x++) {
      console.log(cart.product[x]);
    }

  })
  .catch(error => {
    console.error('Error en la solicitud:', error);

  });

}

let cart = localStorage.getItem("cartID");
cart != null ?  renderCart(cart):console.log("No hay carrito");


window.addCart = (a) => {
  let cart = localStorage.getItem("cartID");
  if (cart == null) {
    const url = "addcart";
    console.log(url);
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
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
      });
  } else {
    const url = `carts/${cart}`
    console.log(url)
    const productData = {
      prod_id: a,
      quantity: 1,
    };
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);
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

let params = "";
render(params);
