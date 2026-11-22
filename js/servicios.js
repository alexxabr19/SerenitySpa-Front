
// Dirección del backend de SerenitySpa
const API_URL = "http://localhost:9191/api/servicios";

// Elementos del formulario
const formulario = document.getElementById("formServicio");
const nombre = document.getElementById("nombre");
const descripcion = document.getElementById("descripcion");
const duracion = document.getElementById("duracion");
const precio = document.getElementById("precio");

const mensaje = document.getElementById("mensaje");
const tablaServicios = document.getElementById("tablaServicios");

const tituloFormulario = document.getElementById("tituloFormulario");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

const btnActualizar = document.getElementById("btnActualizar");
const btnBuscar = document.getElementById("btnBuscar");
const btnListar = document.getElementById("btnListar");
const buscarId = document.getElementById("buscarId");

// Guarda el ID del servicio que estamos editando
let idEditando = null;


// Mostrar mensajes en pantalla
function mostrarMensaje(texto, tipo = "success") {
    mensaje.textContent = texto;
    mensaje.className = `message ${tipo === "error" ? "error" : ""}`;
}


// Limpiar el formulario
function limpiarFormulario() {
    formulario.reset();
    idEditando = null;

    tituloFormulario.textContent = "Registrar servicio";
    btnGuardar.textContent = "Guardar servicio";
    btnCancelar.hidden = true;
}


// Consultar todos los servicios
async function listarServicios() {
    try {
        mostrarMensaje("");

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("No fue posible consultar los servicios.");
        }

        const servicios = await respuesta.json();

        mostrarServicios(servicios);

    } catch (error) {
        mostrarMensaje(error.message, "error");
        tablaServicios.innerHTML = `
            <tr>
                <td colspan="6">No se pudieron cargar los servicios.</td>
            </tr>
        `;
    }
}


// Mostrar los servicios en la tabla
function mostrarServicios(servicios) {
    tablaServicios.innerHTML = "";

    if (!Array.isArray(servicios) || servicios.length === 0) {
        tablaServicios.innerHTML = `
            <tr>
                <td colspan="6">No hay servicios registrados.</td>
            </tr>
        `;
        return;
    }

    servicios.forEach(servicio => {
        const fila = document.createElement("tr");

        const datos = [
            servicio.idServicio,
            servicio.nombre,
            servicio.descripcion,
            `${servicio.duracion} min`,
            Number(servicio.precio).toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
                maximumFractionDigits: 0
            })
        ];

        datos.forEach(dato => {
            const celda = document.createElement("td");
            celda.textContent = dato ?? "";
            fila.appendChild(celda);
        });

        const acciones = document.createElement("td");

        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.className = "btn btn-small me-1";
        botonEditar.type = "button";
        botonEditar.addEventListener("click", () => {
            cargarServicioParaEditar(servicio.idServicio);
        });

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "btn btn-small";
        botonEliminar.type = "button";
        botonEliminar.addEventListener("click", () => {
            eliminarServicio(servicio.idServicio);
        });

        acciones.appendChild(botonEditar);
        acciones.appendChild(botonEliminar);
        fila.appendChild(acciones);

        tablaServicios.appendChild(fila);
    });
}


// Buscar un servicio por su ID
async function buscarServicio() {
    const id = buscarId.value.trim();

    if (!id || Number(id) <= 0) {
        mostrarMensaje("Ingresa un ID válido.", "error");
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/${id}`);

        if (!respuesta.ok) {
            if (respuesta.status === 404) {
                throw new Error("No se encontró un servicio con ese ID.");
            }

            throw new Error("No fue posible buscar el servicio.");
        }

        const servicio = await respuesta.json();

        mostrarServicios([servicio]);
        mostrarMensaje("Servicio encontrado correctamente.");

    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
}


// Registrar un nuevo servicio

async function guardarServicio(evento) {
    evento.preventDefault();

    const servicio = {
        idServicio: 0,
        nombre: nombre.value.trim(),
        descripcion: descripcion.value.trim(),
        duracion: Number(duracion.value),
        precio: Number(precio.value)
    };

    if (
        !servicio.nombre ||
        !servicio.descripcion ||
        !Number.isInteger(servicio.duracion) ||
        servicio.duracion <= 0 ||
        !Number.isFinite(servicio.precio) ||
        servicio.precio <= 0
    ) {
        mostrarMensaje("Verifica los datos ingresados.", "error");
        return;
    }

    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(servicio)
        });

        if (!respuesta.ok) {
            const detalle = await respuesta.text();
            throw new Error(detalle || "No fue posible registrar el servicio.");
        }

        mostrarMensaje("Servicio registrado correctamente.");
        limpiarFormulario();
        await listarServicios();

    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
}



// Consultar un servicio y cargarlo en el formulario
async function cargarServicioParaEditar(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`);

        if (!respuesta.ok) {
            throw new Error("No fue posible consultar el servicio.");
        }

        const servicio = await respuesta.json();

        idEditando = servicio.idServicio;

        nombre.value = servicio.nombre;
        descripcion.value = servicio.descripcion;
        duracion.value = servicio.duracion;
        precio.value = servicio.precio;

        tituloFormulario.textContent = "Editar servicio";
        btnGuardar.textContent = "Actualizar servicio";
        btnCancelar.hidden = false;

        mostrarMensaje("Modifica los datos del servicio y guarda los cambios.");

        formulario.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
}


// Actualizar un servicio existente
async function actualizarServicio() {
    const servicio = {
        idServicio: idEditando,
        nombre: nombre.value.trim(),
        descripcion: descripcion.value.trim(),
        duracion: Number(duracion.value),
        precio: Number(precio.value)
    };

    if (
        !servicio.nombre ||
        !servicio.descripcion ||
        !Number.isInteger(servicio.duracion) ||
        servicio.duracion <= 0 ||
        !Number.isFinite(servicio.precio) ||
        servicio.precio <= 0
    ) {
        mostrarMensaje("Verifica los datos ingresados.", "error");
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/${idEditando}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(servicio)
        });

        if (!respuesta.ok) {
            const detalle = await respuesta.text();
            throw new Error(detalle || "No fue posible actualizar el servicio.");
        }

        mostrarMensaje("Servicio actualizado correctamente.");
        limpiarFormulario();
        await listarServicios();

    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
}


// Eliminar un servicio
async function eliminarServicio(id) {
    const confirmar = confirm(
        `¿Estás segura de que deseas eliminar el servicio ${id}?`
    );

    if (!confirmar) {
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!respuesta.ok) {
            const detalle = await respuesta.text();
            throw new Error(detalle || "No fue posible eliminar el servicio.");
        }

        if (Number(idEditando) === Number(id)) {
            limpiarFormulario();
        }

        mostrarMensaje("Servicio eliminado correctamente.");
        await listarServicios();

    } catch (error) {
        mostrarMensaje(error.message, "error");
    }
}


// Enviar formulario: registrar o actualizar
formulario.addEventListener("submit", async (evento) => {
    if (idEditando === null) {
        await guardarServicio(evento);
    } else {
        evento.preventDefault();
        await actualizarServicio();
    }
});


// Eventos de los botones
btnCancelar.addEventListener("click", () => {
    limpiarFormulario();
    mostrarMensaje("Edición cancelada.");
});

btnActualizar.addEventListener("click", listarServicios);
btnBuscar.addEventListener("click", buscarServicio);
btnListar.addEventListener("click", () => {
    buscarId.value = "";
    listarServicios();
});


// Cargar los servicios al entrar a la página
listarServicios();
