import { apiRequest, mostrarMensaje } from "./api.js";

const form = document.getElementById("formCita");
const body = document.getElementById("tablaBody");
const head = document.getElementById("tablaHead");

async function cargarCitas() {
    try {
        const citas = await apiRequest("/citas");
        head.innerHTML =
            "<tr><th>ID</th><th>Fecha</th><th>Hora</th><th>Estado</th><th>Cliente</th><th>Servicio</th><th>Empleado</th><th>Acciones</th></tr>";
        body.innerHTML = "";

        citas.forEach((c) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${c.idCita ?? ""}</td>
        <td>${c.fecha ?? ""}</td>
        <td>${c.horaInicio ?? ""}</td>
        <td>${c.estado ?? ""}</td>
        <td>${c.cliente?.idCliente ?? c.idCliente ?? ""}</td>
        <td>${c.servicio?.nombre ?? c.servicio?.idServicio ?? c.idServicio ?? ""}</td>
        <td>${c.empleado?.nombre ?? c.empleado?.idEmpleado ?? c.idEmpleado ?? ""}</td>
        <td><button class="btn btn-small" type="button">Cancelar</button></td>
      `;
            tr.querySelector("button").addEventListener("click", () => cancelarCita(c.idCita));
            body.appendChild(tr);
        });
    } catch (e) {
        mostrarMensaje("mensaje", e.message, "error");
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("idCita").value;
    const cita = {
        fecha: document.getElementById("fecha").value,
        horaInicio: document.getElementById("horaInicio").value,
        estado: document.getElementById("estado").value.trim(),
        idCliente: Number(document.getElementById("idCliente").value),
        idServicio: Number(document.getElementById("idServicio").value),
        idEmpleado: Number(document.getElementById("idEmpleado").value),
        idSede: Number(document.getElementById("idSede").value)
    };

    try {
        if (id) {
            await apiRequest(`/citas/${id}`, { method: "PUT", body: JSON.stringify(cita) });
        } else {
            await apiRequest("/citas", { method: "POST", body: JSON.stringify(cita) });
        }
        mostrarMensaje("mensaje", "Cita guardada correctamente.");
        form.reset();
        await cargarCitas();
    } catch (e) {
        mostrarMensaje("mensaje", e.message, "error");
    }
});

async function cancelarCita(id) {
    if (!confirm("¿Deseas cancelar esta cita?")) return;
    try {
        await apiRequest(`/citas/${id}`, { method: "DELETE" });
        mostrarMensaje("mensaje", "Cita cancelada.");
        await cargarCitas();
    } catch (e) {
        mostrarMensaje("mensaje", e.message, "error");
    }
}

document.getElementById("btnRecargar").addEventListener("click", cargarCitas);
cargarCitas();