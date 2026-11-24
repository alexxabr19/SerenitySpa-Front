import { apiRequest, mostrarMensaje } from "./api.js";

const form = document.getElementById("formFactura");
const body = document.getElementById("tablaBody");
const head = document.getElementById("tablaHead");

async function cargarFacturas() {
    try {
        const facturas = await apiRequest("/facturas");
        head.innerHTML =
            "<tr><th>ID</th><th>Fecha</th><th>Monto</th><th>Método</th><th>Estado</th><th>ID cita</th><th>Acciones</th></tr>";
        body.innerHTML = "";

        facturas.forEach((f) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${f.idFactura ?? ""}</td>
        <td>${f.fecha ?? ""}</td>
        <td>${f.montoTotal ?? ""}</td>
        <td>${f.metodoPago ?? ""}</td>
        <td>${f.estado ?? ""}</td>
        <td>${f.cita?.idCita ?? f.idCita ?? ""}</td>
        <td><button class="btn btn-small" type="button">Eliminar</button></td>
      `;
            tr.querySelector("button").addEventListener("click", () => eliminarFactura(f.idFactura));
            body.appendChild(tr);
        });
    } catch (e) {
        mostrarMensaje("mensaje", e.message, "error");
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("idFactura").value;
    const factura = {
        fecha: document.getElementById("fecha").value,
        montoTotal: Number(document.getElementById("montoTotal").value),
        metodoPago: document.getElementById("metodoPago").value.trim(),
        estado: document.getElementById("estado").value.trim(),
        idCita: Number(document.getElementById("idCita").value)
    };

    try {
        if (id) {
            await apiRequest(`/facturas/${id}`, { method: "PUT", body: JSON.stringify(factura) });
        } else {
            await apiRequest("/facturas", { method: "POST", body: JSON.stringify(factura) });
        }
        mostrarMensaje("mensaje", "Factura guardada correctamente.");
        form.reset();
        await cargarFacturas();
    } catch (e) {
        mostrarMensaje("mensaje", e.message, "error");
    }
});

async function eliminarFactura(id) {
    if (!confirm("¿Deseas eliminar esta factura?")) return;
    try {
        await apiRequest(`/facturas/${id}`, { method: "DELETE" });
        mostrarMensaje("mensaje", "Factura eliminada.");
        await cargarFacturas();
    } catch (e) {
        mostrarMensaje("mensaje", e.message, "error");
    }
}

document.getElementById("btnRecargar").addEventListener("click", cargarFacturas);
cargarFacturas();