import { apiRequest, mostrarMensaje } from "./api.js";

const form = document.getElementById("formCliente");
const body = document.getElementById("tablaBody");
const head = document.getElementById("tablaHead");

async function cargarClientes() {
    try {
        const clientes = await apiRequest("/clientes");
        head.innerHTML =
            "<tr><th>ID</th><th>Nombre</th><th>Apellido</th><th>Correo</th><th>Teléfono</th><th>Acciones</th></tr>";
        body.innerHTML = "";

        clientes.forEach((c) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${c.idCliente}</td><td>${c.nombre ?? ""}</td><td>${c.apellido ?? ""}</td><td>${c.correo ?? ""}</td><td>${c.telefono ?? ""}</td><td><button class="btn btn-small" data-id="${c.idCliente}">Eliminar</button></td>`;
            tr.querySelector("button").addEventListener("click", () => eliminarCliente(c.idCliente));
            body.appendChild(tr);
        });
    } catch (e) {
        mostrarMensaje("mensaje", e.message, "error");
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("idCliente").value;
    const cliente = {
        nombre: document.getElementById("nombre").value.trim(),
        apellido: document.getElementById("apellido").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
    };

    try {
        if (id) {
            await apiRequest(`/clientes/${id}`, { method: "PUT", body: JSON.stringify(cliente) });
        } else {
            await apiRequest("/clientes", { method: "POST", body: JSON.stringify(cliente) });
        }
        mostrarMensaje("mensaje", "Cliente guardado correctamente.");
        form.reset();
        await cargarClientes();
    } catch (e) {
        mostrarMensaje("mensaje", e.message, "error");
    }
});

async function eliminarCliente(id) {
    if (!confirm("¿Deseas eliminar este cliente?")) return;
    try {
        await apiRequest(`/clientes/${id}`, { method: "DELETE" });
        mostrarMensaje("mensaje", "Cliente eliminado.");
        await cargarClientes();
    } catch (e) {
        mostrarMensaje("mensaje", e.message, "error");
    }
}

document.getElementById("btnRecargar").addEventListener("click", cargarClientes);
cargarClientes();