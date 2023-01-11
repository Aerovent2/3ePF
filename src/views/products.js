




const view= `
<div class="container  mt-3">
        <h1>Cargar Nuevo Producto</h1>
       
        <form  action="/api/productos" method=POST class="row g-3">
            <input id="nombre" type="text" placeholder="Ingrese titulo" name="nombre" class="form-control" required>
            <input id="descripcion" type="text" placeholder="Ingrese descripcion" name="descripcion" class="form-control" required>
            <input id="codigo" type="text" placeholder="Ingrese codigo" name="codigo" class="form-control" required>
            <input id="url" type="text" placeholder="Ingrese url imagen" name="url" class="form-control" required>
            <input id="precio" type="number" placeholder="Ingrese precio" name="precio" class="form-control" required>
            <input id="stock" type="number" placeholder="Ingrese stock" name="stock" class="form-control" required>
            <input id="submit" type="submit" value="enviar" class="btn btn-primary mb-3">
        </form>

`


const viewProductos= `

<div class="container mt-3">
<h1>View Productos</h1>
<table  id="tabla" class="table table-primary" align="center">
    <thead>
        <tr class="table-dark">
            <th>Producto</th>
            <th>Precio</th>
            <th>Miniatura</th>
            <th>Acciones</th>
        </tr>
    </thead>
    {{#each productos}}
        <tr> 
            <td class="table-info">{{this.nombre}}</td>
            <td class="table-success"> {{this.precio}}</td>
            <td class="table-warning"><img style="height: 30px" class="img-fluid" src="{{this.url}}" alt="imagen"/></td>
            <td class="table-danger"><button  id="{{this._id}}" class="btn btn-danger comprar">Agregar al Carrito</button></td>
        </tr>
    {{/each}}
</table>

`
const viewCarrito= `

<div class="container mt-3">
<h1>View Carrito</h1>
<table  id="tablaCarrito" class="table table-primary" align="center">
    <thead>
        <tr class="table-dark">
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Acciones</th>
        </tr>
    </thead>
    {{#each carrito}}
        <tr> 
            <td class="table-info">{{this.producto.nombre}}</td>
            <td class="table-success"> {{this.cant}}</td>
            <td class="table-success"> {{this.producto.precio}}</td>
            <td class="table-danger"><button  id="{{this.producto._id}}" class="btn btn-danger comprar">Quitar uno del Carrito</button></td>
        </tr>
    {{/each}}
</table>
  <div>
    <button  id="finalizarCompra" class="btn btn-info comprar">Finalizar Compra</button>
    <button  id="eliminarCarrito" class="btn btn-danger comprar">Borrar Carrito</button>
  </div>

`





///////////////////////////////////////////////////////////////////
let idCarrito,usuario,idUsuario


const title = document.getElementById('title')
const price = document.getElementById('price')
const thumbnail = document.getElementById('thumbnail')
const salir = document.getElementById('salir')
const saludo=document.getElementById('saludo')
const imagen = document.getElementById('foto')
const verCarrito= document.getElementById('cart')
const verProductos= document.getElementById('productos')


const botonesAgregar =()=>{
  const tabla= document.getElementById('tabla')
  const botones = tabla.querySelectorAll("button")
  for(let i= 0; i<botones.length; i++){
    botones[i].addEventListener('click',(e)=>{
      e.preventDefault()
       let idProducto = e.target.id;
       fetch(`/api/carrito/${idCarrito}/productos`, {
        method: "POST", 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idProducto: idProducto })
      }).then(res => {
        if(res.status!==200) console.error('Ocurrio un error al agregar el item')
      });  
    },false)
  }
}

const botonesQuitar =()=>{
  const tabla= document.getElementById('tablaCarrito')
  const botones = tabla.querySelectorAll("button")
  for(let i= 0; i<botones.length; i++){
    botones[i].addEventListener('click',(e)=>{
      e.preventDefault()
       let idProducto = e.target.id;
       fetch(`/api/carrito/${idCarrito}/productos/${idProducto}`, {
        method: "DELETE", 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => {
      if(res.status!==200) console.error('Ocurrio un error al borrar el item')
      mostrarCarrito()
      });  
    },false)
  }
}

const botonVaciar =()=>{
  document.getElementById('eliminarCarrito')
  .addEventListener('click',(e)=>{
    e.preventDefault()
    
    fetch(`/api/carrito/${idCarrito}`, {
      method: "DELETE"
    }).then(res => {
    if(res.status!==200) console.error('Ocurrio un error al borrar el Carrito')
    window.location.href = "/";})
  })}

  const botonCompra =()=>{
    document.getElementById('finalizarCompra')
    .addEventListener('click',(e)=>{
      e.preventDefault()
      
      fetch(`/api/carrito/${idCarrito}/finalizar`, {
        method: "POST"
      }).then(res => {
      if(res.status!==200) console.error('Ocurrio un error al Finalizar Compra')
      window.location.href = "/";})
    })}



salir.addEventListener('click',(e)=>{
  e.preventDefault();
  saludo.innerText='Hasta Luego '+ usuario
  setTimeout(function() {
    window.location.href = "/logout";
  }, 2000);
})



fetch('/user')
.then((response)=>response.json())
.then((res)=>{
  
  saludo.innerText="Bienvenido "+ res.usuario
  usuario=res.usuario
  imagen.setAttribute('src',res.foto)
  
  if(!res.cart){
    idCarrito=fetch(`/api/carrito`, {
      method: "POST", 
    })
    .then((response)=>response.json())
    .then(res => {
      idCarrito=res.idCarrito
      console.log(`no habia carrito se creo uno nuevo id ${idCarrito}`)
    })
  }else{
    idCarrito=res.cart
    console.log(`carrito existente id ${idCarrito}`)
  }

  if(res.admin){
    const viewController= Handlebars.compile(view)
    const viewHtml =viewController()
    document.getElementById('divCargaProductos').innerHTML = viewHtml
 
  }
});



const mostrarCarrito=()=>{
  fetch(`/api/carrito/${idCarrito}/productos`)
  .then((response)=>response.json())
  .then((json)=>{
    const carrito = Object.assign({}, json)
    const prodController= Handlebars.compile(viewCarrito)
    const prodHtml =prodController({carrito})
    document.getElementById('divProductos').innerHTML = prodHtml
    botonCompra()
    botonesQuitar()
    botonVaciar()
  }); 
}
const mostrarProductos=()=>{
  fetch('/api/productos')
  .then((response)=>response.json())
  .then((json)=>{
      const productos = Object.assign({}, json)
      const prodController= Handlebars.compile(viewProductos)
      const prodHtml =prodController({productos})
      document.getElementById('divProductos').innerHTML = prodHtml
      botonesAgregar()
  }); 
}

verCarrito.addEventListener('click',(e)=>{
  e.preventDefault();
  mostrarCarrito()
})
verProductos.addEventListener('click',(e)=>{
  e.preventDefault();
  mostrarProductos()
})

mostrarProductos()



