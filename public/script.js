let div_render = document.getElementById('productos_render');
let div_toggle_bar = document.getElementById('ul-toggle');

{/* <li class="nav-item">
<a class="nav-link active" aria-current="page" href="#">Home</a>
</li> */}

const ask_product = async (URL) => {

    try {
      const response = await fetch(URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      //console.log(data);
      return data;
    } catch (error) {
      console.error('Error:', error.message);
    }
  };


const render = async (a) =>{
    div_render.innerHTML= ""
    let URL = '';
    if(a == ''){
        URL = 'api/products'
    }else{
        URL = a
    }
    let data = await ask_product(URL);
    for (let x = 0; x < data.payload.length; x++) {
        div_render.innerHTML += `<div class="card col-md-4 m-3" style="width: 18rem;">
          <img src="${data.payload[x].thumbnail}" class="card-img-top img-fluid" alt="...">
          <div class="card-body">
            <h5 class="card-title">${data.payload[x].title}</h5>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>`;
      }
}

let params = ""
  render(params);