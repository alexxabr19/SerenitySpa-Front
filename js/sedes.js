
const API_URL = "http://localhost:9191/api/sedes";

const formSede = document.getElementById("formSede");
const tablaSedes = document.getElementById("tablaSedes");
const mensaje = document.getElementById("mensaje");

let idEditando = null;

// Mostrar mensajes
function mostrarMensaje(texto, tipo = "success") {
    mensaje.textContent = texto;
    mensaje.className = `message mt-3 ${tipo}`;
}

// Limpiar formulario
function limpiarFormulario() {
    formSede.reset();
    idEditando = null;
    document.getElementById("btnGuardar").textContent = "Guardar sede";
}

// Listar sedes
async function listarSedes() {
    try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("No fue posible consultar las sedes.");
        }

        const sedes = await respuesta.json();

        mostrarSedes(sedes);

    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
}

// Mostrar sedes en la tabla
function mostrarSedes(sedes) {
    tablaSedes.innerHTML = "";

    if (sedes.length === 0) {
        tablaSedes.innerHTML = `
            <tr>
                <td colspan="6">No hay sedes registradas.</td>
            </tr>
        `;
        return;
    }

    sedes.forEach(sede => {
        const fila = document.createElement("tr");

        const valores = [
            sede.idSede,
            sede.nombre,
            sede.direccion,
            sede.telefono,
            sede.ciudad
        ];

        valores.forEach(valor => {
            const celda = document.createElement("td");
            celda.textContent = valor ?? "";
            fila.appendChild(celda);
        });

        const acciones = document.createElement("td");

        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.className = "btn btn-secondary btn-sm";
        botonEditar.addEventListener("click", () => cargarSede(sede.idSede));

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "btn btn-danger btn-sm ms-2";
        botonEliminar.addEventListener("click", () => eliminarSede(sede.idSede));

        acciones.appendChild(botonEditar);
        acciones.appendChild(botonEliminar);

        fila.appendChild(acciones);
        tablaSedes.appendChild(fila);
    });
}

// Buscar sede por ID
async function buscarSede() {
    const id = document.getElementById("buscarId").value;

    if (!id || Number(id) <= 0) {
        mostrarMensaje("Ingrese un ID válido.", "error");
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/${id}`);

        if (!respuesta.ok) {
            throw new Error("No se encontró la sede.");
        }

        const sede = await respuesta.json();

        mostrarSedes([sede]);
        mostrarMensaje("Sede encontrada correctamente.");

    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
}

// Cargar sede para editar
async function cargarSede(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`);

        if (!respuesta.ok) {
            throw new Error("No fue posible cargar la sede.");
        }

        const sede = await respuesta.json();

        document.getElementById("nombre").value = sede.nombre;
        document.getElementById("direccion").value = sede.direccion;
        document.getElementById("telefono").value = sede.telefono;
        document.getElementById("ciudad").value = sede.ciudad;

        idEditando = id;

        document.getElementById("btnGuardar").textContent = "Actualizar sede";

        mostrarMensaje("Sede cargada para editar.");

        formSede.scrollIntoView({ behavior: "smooth" });

    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
}

// Registrar sede

async function guardarSede() {
    const sede = {
        idSede: 0,
        nombre: document.getElementById("nombre").value.trim(),
        direccion: document.getElementById("direccion").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        ciudad: document.getElementById("ciudad").value.trim()
    };

    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sede)
        });

        if (!respuesta.ok) {
            throw new Error("No fue posible registrar la sede.");
        }

        mostrarMensaje("Sede registrada correctamente.");
        limpiarFormulario();
        listarSedes();

    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
}


// Actualizar sede
async function actualizarSede() {
    const sede = {
        idSede: idEditando,
        nombre: document.getElementById("nombre").value.trim(),
        direccion: document.getElementById("direccion").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        ciudad: document.getElementById("ciudad").value.trim()
    };

    try {
        const respuesta = await fetch(`${API_URL}/${idEditando}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sede)
        });

        if (!respuesta.ok) {
            throw new Error("No fue posible actualizar la sede.");
        }

        mostrarMensaje("Sede actualizada correctamente.");
        limpiarFormulario();
        listarSedes();

    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
}

// Eliminar sede
async function eliminarSede(id) {
    const confirmar = confirm("¿Está seguro de eliminar esta sede?");

    if (!confirmar) {
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!respuesta.ok) {
            throw new Error("No fue posible eliminar la sede.");
        }

        mostrarMensaje("Sede eliminada correctamente.");
        listarSedes();

    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
}

// Guardar o actualizar al enviar el formulario
formSede.addEventListener("submit", function(event) {
    event.preventDefault();

    if (idEditando === null) {
        guardarSede();
    } else {
        actualizarSede();
    }
});

// Eventos de los botones
document.getElementById("btnListar").addEventListener("click", listarSedes);
document.getElementById("btnBuscar").addEventListener("click", buscarSede);
document.getElementById("btnCancelar").addEventListener("click", limpiarFormulario);

// Cargar sedes al abrir la página
listarSedes();
