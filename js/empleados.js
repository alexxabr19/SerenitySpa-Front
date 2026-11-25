import { apiRequest, mostrarMensaje } from "./api.js";

const form = document.getElementById("formEmpleado");
const body = document.getElementById("tablaBody");
const head = document.getElementById("tablaHead");

async function cargarEmpleados() {
    try {
        const empleados = await apiRequest("/empleados");
        head.innerHTML =
            "<tr><th>ID</th><th>Nombre</th><th>Cargo</th><th>Correo</th><th>Teléfono</th><th>Acciones</th></tr>";
        body.innerHTML = "";

        empleados.forEach((emp) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${emp.idEmpleado}</td><td>${emp.nombre ?? ""}</td><td>${emp.cargo ?? ""}</td><td>${emp.correo ?? ""}</td><td>${emp.telefono ?? ""}</td><td><button class="btn btn-small" data-id="${emp.idEmpleado}">Eliminar</button></td>`;
            tr.querySelector("button").addEventListener("click", () => eliminarEmpleado(emp.idEmpleado));
            body.appendChild(tr);
        });
    } catch (e) {
        mostrarMensaje("mensaje", e.message, "error");
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("idEmpleado").value;
    const ids = document
        .getElementById("servicios")
        .value.split(",")
        .map((x) => x.trim())
        .filter(Boolean);

    const empleado = {
        nombre: document.getElementById("nombre").value.trim(),
        cargo: document.getElementById("cargo").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        serviciosHabilitados: ids.map((idServicio) => ({ idServicio: Number(idServicio) })),
    };

    try {
        if (id) {
            await apiRequest(`/empleados/${id}`, { method: "PUT", body: JSON.stringify(empleado) });
        } else {
            await apiRequest("/empleados", { method: "POST", body: JSON.stringify(empleado) });
        }
        mostrarMensaje("mensaje", "Empleado guardado correctamente.");
        form.reset();
        await cargarEmpleados();
    } catch (e) {
        mostrarMensaje("mensaje", e.message, "error");
    }
});

async function eliminarEmpleado(id) {
    if (!confirm("¿Deseas eliminar este empleado?")) return;
    try {
        await apiRequest(`/empleados/${id}`, { method: "DELETE" });
        mostrarMensaje("mensaje", "Empleado eliminado.");
        await cargarEmpleados();
    } catch (e) {
        mostrarMensaje("mensaje", e.message, "error");
    }
}

document.getElementById("btnRecargar").addEventListener("click", cargarEmpleados);
cargarEmpleados();