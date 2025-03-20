document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".formulario");

    form.addEventListener("submit", (event) => {
        event.preventDefault(); 

        const name = document.getElementById("nombre").value.trim();
        const priceValue = document.getElementById("precio").value.trim();
        const stockValue = document.getElementById("stock").value.trim();

        // Validar que los valores no estén vacíos
        if (!name || !priceValue || !stockValue) {
            alert("Por favor, completa todos los campos correctamente.");
            return;
        }

        // Validar que el precio sea un número válido con decimales
        if (!/^\d+(\.\d+)?$/.test(priceValue)) {
            alert("El precio debe ser un número válido (puede incluir decimales).");
            return;
        }

        // Convertir los valores a número
        const price = parseFloat(priceValue);
        const stock = Number(stockValue); // Convertir el stock a número

        // Validar que el precio y stock sean números
        if (isNaN(price) || isNaN(stock)) {
            alert("Ingresa valores numéricos en precio y stock.");
            return;
        }

        // Validar que el precio no sea negativo
        if (price < 0) {
            alert("El precio no puede ser negativo.");
            return;
        }

        // Validar que el stock sea un número entero positivo
        if (!Number.isInteger(stock)) {
            alert("El stock debe ser un número entero.");
            return;
        }

        if (stock < 0) {
            alert("El stock no puede ser negativo.");
            return;
        }

        // Crear objeto con los datos
        const nuevoProducto = { name, price, stock };

        // Hacer la petición al backend
        fetch("http://localhost:3000/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoProducto),
        })
        .then(response => {
            if (!response.ok) throw new Error("Error al agregar producto");
            return response.json();
        })
        .then(data => {
            console.log("Producto agregado:", data);
            alert("Producto agregado con éxito");
            form.reset(); 
        })
        .catch(error => console.error("Error:", error));
    });
});
