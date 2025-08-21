let productos = JSON.parse(localStorage.getItem("productos")) || [];
let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
let carrito = [];
let total = 0;

// Referencias HTML
const listaProductos = document.getElementById("listaProductos");
const listaCarrito = document.getElementById("carrito");
const listaVentas = document.getElementById("listaVentas");
const totalSpan = document.getElementById("total");
const formProducto = document.getElementById("formProducto");

// Función para mostrar productos en inventario
function mostrarProductos() {
  listaProductos.innerHTML = "";
  productos.forEach((p, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${p.nombre} - $${p.precio} - Stock: ${p.stock} 
      <button onclick="agregarAlCarrito(${i})">Agregar al carrito</button>`;
    if(p.stock <= 2) li.classList.add("alerta");
    listaProductos.appendChild(li);
  });
}

// Agregar producto
formProducto.addEventListener("submit", e => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const stock = parseInt(document.getElementById("stock").value);
  productos.push({nombre, precio, stock});
  localStorage.setItem("productos", JSON.stringify(productos));
  formProducto.reset();
  mostrarProductos();
});

// Agregar al carrito
function agregarAlCarrito(index) {
  if(productos[index].stock > 0){
    carrito.push({ ...productos[index] });
    productos[index].stock--;
    total += productos[index].precio;
    actualizarCarrito();
    mostrarProductos();
  } else {
    alert("❌ Stock insuficiente");
  }
}

// Actualizar carrito
function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  carrito.forEach((item, i) => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio}`;
    listaCarrito.appendChild(li);
  });
  totalSpan.textContent = total;
}

// Registrar venta
function registrarVenta() {
  if(carrito.length === 0){
    alert("❌ No hay productos en el carrito");
    return;
  }
  const venta = { productos: [...carrito], total, fecha: new Date().toLocaleString() };
  ventas.push(venta);
  localStorage.setItem("ventas", JSON.stringify(ventas));
  carrito = [];
  total = 0;
  actualizarCarrito();
  mostrarHistorial();
  mostrarProductos();
  alert("✅ Venta registrada");
}

// Mostrar historial
function mostrarHistorial() {
  listaVentas.innerHTML = "";
  ventas.forEach(v => {
    const li = document.createElement("li");
    li.textContent = `${v.fecha} - Total: $${v.total} - Productos: ${v.productos.map(p => p.nombre).join(", ")}`;
    listaVentas.appendChild(li);
  });
}

// Inicializar
mostrarProductos();
mostrarHistorial();

// Service Worker
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js");
}

