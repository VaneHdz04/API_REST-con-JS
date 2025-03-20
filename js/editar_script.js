document.addEventListener("DOMContentLoaded", async () => {
    const productList = document.querySelector(".container-list");
    const form = document.querySelector(".form");
    const searchInput = document.getElementById("search");
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    // Función para obtener todos los productos desde el backend
    async function fetchProducts(query = "") {
        try {
            let url = "http://localhost:3000/";
            if (query) {
                url = `http://localhost:3000/search?name=${query}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error("Error al obtener productos");

            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error("Error al cargar productos:", error);
            productList.innerHTML = "<p>Error al cargar productos</p>";
        }
    }

    // Función para mostrar productos en las tarjetas
    function displayProducts(products) {
        productList.innerHTML = "";

        if (products.length === 0) {
            productList.innerHTML = "<p>No se encontraron productos</p>";
            return;
        }

        products.forEach(product => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <h3 class="card-title">${product.name}</h3>
                <p class="card-stock">Stock: ${product.stock} pz</p>
                <div>
                    <button class="card-button card-button_edit" data-id="${product.id || product._id}">
                        <i class="bi bi-pen"></i>
                    </button>
                    <span class="card-precio">$${product.price}</span>
                </div>
            `;
            productList.appendChild(card);
        });
    }

    // Función para obtener los datos de un producto específico
    async function fetchProductById(id) {
        try {
            const response = await fetch(`http://localhost:3000/${id}`);
            if (!response.ok) throw new Error("No se encontró el producto");

            return await response.json();
        } catch (error) {
            console.error("Error al cargar datos del producto:", error);
            alert("No se encontró el producto.");
            return null;
        }
    }

    // Si hay un ID en la URL, cargar los datos del producto en el formulario
    if (productId) {
        const product = await fetchProductById(productId);
        if (product) {
            form.name.value = product.name;
            form.precio.value = product.price;
            form.stock.value = product.stock;
        }
    }

    // Manejo de la edición de un producto
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!productId) {
            alert("Error: No se ha seleccionado un producto existente para editar.");
            return;
        }

        const priceInput = form.precio.value.trim();

        // Expresión regular para validar el precio (solo números y opcionalmente un punto decimal)
        const pricePattern = /^\d+(\.\d{1,2})?$/;

        if (!pricePattern.test(priceInput)) {
            alert("Error: El precio solo debe contener números y, opcionalmente, un punto decimal.");
            return;
        }

        const updatedProduct = {
            name: form.name.value.trim(),
            price: parseFloat(priceInput),
            stock: Number(form.stock.value)
        };

        if (!updatedProduct.name || isNaN(updatedProduct.price) || isNaN(updatedProduct.stock)) {
            alert("Por favor, completa todos los campos correctamente.");
            return;
        }

        // Validaciones
        if (updatedProduct.price < 0) {
            alert("El precio no puede ser un número negativo. Ingresa valores válidos.");
            return;
        }

        if (!Number.isInteger(updatedProduct.stock)) {
            alert("El stock debe ser un número entero. No se permiten decimales.");
            return;
        }

        if (updatedProduct.stock < 0) {
            alert("El stock no puede ser un número negativo. Ingresa valores válidos.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedProduct)
            });

            if (!response.ok) throw new Error("Error al actualizar producto");

            alert("Producto actualizado correctamente");
            window.location.href = "editar.html";
        } catch (error) {
            console.error("Error en la petición:", error);
        }
    });

    // Evento para seleccionar un producto y editarlo
    productList.addEventListener("click", async (e) => {
        const editButton = e.target.closest(".card-button_edit");
        if (editButton) {
            const selectedId = editButton.dataset.id;
            if (selectedId) {
                try {
                    const response = await fetch(`http://localhost:3000/${selectedId}`);
                    if (!response.ok) throw new Error("No se encontró el producto");
    
                    const product = await response.json();
    
                    if (product) {
                        window.location.href = `editar.html?id=${selectedId}`;
                    } else {
                        alert("El producto seleccionado no existe.");
                    }
                } catch (error) {
                    console.error("Error al verificar el producto:", error);
                    alert("No se encontró el producto.");
                }
            } else {
                console.error("No se encontró el ID del producto");
            }
        }
    });

    // Evento para la búsqueda en tiempo real
    searchInput.addEventListener("input", async (e) => {
        const query = e.target.value.trim();
        await fetchProducts(query);
    });

    // Cargar todos los productos
    await fetchProducts();
});
