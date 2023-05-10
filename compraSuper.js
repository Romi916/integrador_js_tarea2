

// Cada producto que vende el super es creado con esta clase
class Producto {
    sku;            // Identificador único del producto
    nombre;         // Su nombre
    cattegoria;      // Categoría a la que pertenece este producto
    precio;         // Su precio
    stock;          // Cantidad disponible en stock

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;

        // Si no me definen stock, pongo 10 por default
        if (typeof stock !== 'undefined') {
            this.stock = stock;
        } else {
            this.stock = 10;
        }
    }

}


// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];


// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
    productos;      // Lista de productos agregados
    categorias;     // Lista de las diferentes categorías de los productos en el carrito
    precioTotal;    // Lo que voy a pagar al finalizar mi compra

    // Al crear un carrito, empieza vació
    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];
    }

    /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */
    async agregarProducto(sku, cantidad) {
        console.log(`Agregando ${cantidad} ${sku}`);

        try {
            
        // Busco el producto en la "base de datos"
        const producto = await findProductBySku(sku);

        console.log("Producto encontrado", producto);

        // Creo un producto nuevo
        const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);
        this.productos.push(nuevoProducto);
        this.precioTotal = this.precioTotal + (producto.precio * cantidad);
        this.categorias.push(producto.categoria);

        //verificar si la categoria ya esta en la lista de categorias
        if (!this.categorias.includes(producto.categoria)){
            this.categorias.push(producto.categoria);

        }

        
        } catch (error) {
            console.log(error);
            console.log(`No se pudo agregar el producto ${sku}, producto no disponible `);
            
        }


    }

    /**
     * función que elimina @{cantidad} de productos con @{sku} al carrito
     */
    async eliminarProducto(sku, cantidad) {
        return new Promise(async (resolve, reject) => {
        console.log(`Eliminando ${cantidad} ${sku}`);

        try {
            // Busco el producto en el carrito
            const productoIndex = this.productos.findIndex(producto => producto.sku === sku);
            const productoEncontrado = this.productos[productoIndex];
            
            // Si encuentro el producto en el carrito y la cantidad que se quiere eliminar es menor o igual a la cantidad en el carrito
            if (productoIndex !== -1 && productoEncontrado.cantidad >= cantidad) {
                // Actualizo la cantidad en el producto del carrito
                productoEncontrado.cantidad -= cantidad;

                // Actualizo el precio total del carrito
                const producto = await findProductBySku(sku);
                this.precioTotal -= producto.precio * cantidad;

                // Si la cantidad del producto en el carrito es 0, lo elimino
                if (productoEncontrado.cantidad === 0) {
                    this.productos.splice(productoIndex, 1);
                    // Si el producto eliminado pertenecía a una categoría que sólo estaba en el carrito una vez, la elimino de la lista de categorías
                    const categoria = productoEncontrado.categoria;
                    const categoriaCount = this.productos.filter(producto => producto.categoria === categoria).length;
                    if (categoriaCount === 0) {
                        this.categorias.splice(this.categorias.indexOf(categoria), 1);
                    }
                }
                console.log(`Se eliminaron ${cantidad} ${sku} del carrito.`);
            } else {
                console.log(`No se pudo eliminar ${cantidad} ${sku} del carrito.`);
            }

            // Resuelvo la promesa
                return Promise.resolve(`Producto ${sku} eliminado`);
            
        } catch (error) {
            console.log(error);
            console.log(`No se pudo eliminar el producto ${sku}, producto no disponible`);
        }
     });
    }
}



// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
    sku;       // Identificador único del producto
    nombre;    // Su nombre
    cantidad;  // Cantidad de este producto en el carrito

    constructor(sku, nombre, cantidad) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(product => product.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                reject(new Error ('Product ${sku} not found'));
            }
        }, 1500);
    });
}

const carrito = new Carrito();
carrito.agregarProducto('WE328NJ', 2);
carrito.eliminarProducto('XX92LKI', 30)
  .then(() => console.log('Producto eliminado exitosamente'))
  .catch((error) => console.log(`No se pudo eliminar el producto. Error: ${error}`));
