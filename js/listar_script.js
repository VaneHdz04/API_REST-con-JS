document.addEventListener("DOMContentLoaded", () => {
    const productList = document.querySelector(".container-list");
    const searchInput = document.getElementById("search");

    //Obtener los productos y mostrarlos en la lista
    function fetchProducts(query = "") {
        let url = "http://localhost:3000/";
        if (query) {
            url = `http://localhost:3000/search/?name=${query}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log("Productos recibidos:", data);
                productList.innerHTML = ""; 

                if (data.length === 0) {
                    productList.innerHTML = "<p>No se encontraron productos</p>";
                    return;
                }

                data.forEach(product => {
                    const productCard = document.createElement("div");
                    productCard.classList.add("card");
                    productCard.innerHTML = `
                        <h3 class="card-title">${product.name}</h3>
                        <p class="card-stock">Stock: ${product.stock || "N/A"} pz</p>
                        <div>
                            <button class="card-button card-button_delete" data-id="${product.id || product._id}">
                                <i class="bi bi-trash-fill"></i> 
                            </button>
                            <span class="card-precio">$${product.price}</span>
                        </div>
                    `;
                    productList.appendChild(productCard);
                });
            })
            .catch(error => console.error("Error al obtener productos:", error));
    }

    // Confirmar eliminación y hacer la petición
    function deleteProduct(productId) {
        if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
            return;
        }

        fetch(`http://localhost:3000/${productId}`, { 
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) throw new Error("Error al eliminar producto");
            return response.json();
        })
        .then(data => {
            console.log("Producto eliminado:", data);
            alert("Producto eliminado con éxito");
            fetchProducts(); // Recargar productos después de eliminar
        })
        .catch(error => console.error("Error al eliminar producto:", error));
    }

    // Evento para eliminar productos
    productList.addEventListener("click", (e) => {
        const deleteButton = e.target.closest(".card-button_delete");
        if (deleteButton) {
            const productId = deleteButton.dataset.id;
            if (productId) {
                deleteProduct(productId);
            } else {
                console.error("Error: No se encontró el ID del producto");
            }
        }
    });

    // Función para búsqueda
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim();
        fetchProducts(query);
    });

    // Cargar productos al inicio
    fetchProducts();
});

