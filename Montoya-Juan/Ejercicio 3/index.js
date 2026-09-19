const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// Arreglo interno para conservar las tareas
let tareas = [];

// GET para consultar tareas (Con soporte para filtrar por estado)
app.get("/api/tareas", (req, res) => {
    // Capturamos el parametro de consulta
    const estado = req.query.estado;

    if (estado === "completada") {
        const completadas = tareas.filter((t) => t.completada === true);
        return res.send(completadas);
    } else if (estado === "pendiente") {
        const pendientes = tareas.filter((t) => t.completada === false);
        return res.send(pendientes);
    }

    // Si no se envia filtro o es distinto se devuelven todas las tareas
    res.send(tareas);
});

// POST para crear una tarea nueva
app.post("/api/tareas", (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).send("Falta el dato requerido: nombre");
    }

    // Validar nombre unico
    const existe = tareas.find((t) => t.nombre.toLowerCase() === nombre.toLowerCase());
    if (existe) {
        return res.status(400).send("Ya existe una tarea registrada con ese nombre");
    }

    // Se crea asumiendo que arranca sin completar
    const nuevaTarea = {
        nombre: nombre,
        completada: false
    };

    tareas.push(nuevaTarea);
    res.status(201).send("Tarea creada exitosamente");
});

// PUT para modificar una tarea
app.put("/api/tareas/:nombre", (req, res) => {
    const nombreParam = req.params.nombre;
    const { nombre: nuevoNombre, completada } = req.body;

    const tareaIndex = tareas.findIndex((t) => t.nombre.toLowerCase() === nombreParam.toLowerCase());

    if (tareaIndex === -1) {
        return res.status(404).send("Tarea no encontrada para modificar");
    }

    if (!nuevoNombre || typeof completada !== "boolean") {
        return res.status(400).send("Faltan datos o el formato es invalido. Se requiere 'nombre' (texto) y 'completada' (true/false)");
    }

    // Validar que el nuevo nombre no choque con otra tarea si es que decidio cambiarle el nombre
    if (nuevoNombre.toLowerCase() !== nombreParam.toLowerCase()) {
        const existeOtro = tareas.find((t) => t.nombre.toLowerCase() === nuevoNombre.toLowerCase());
        if (existeOtro) {
            return res.status(400).send("Ya existe otra tarea distinta con ese nuevo nombre");
        }
    }

    // Actualizacion
    tareas[tareaIndex].nombre = nuevoNombre;
    tareas[tareaIndex].completada = completada;

    res.send("Tarea actualizada exitosamente");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});