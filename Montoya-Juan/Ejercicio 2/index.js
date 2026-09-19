const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// Arreglo interno para conservar la informacion
let alumnos = [];

// GET para consultar un alumno y sus datos derivados
app.get("/api/alumnos/:nombre", (req, res) => {
    const nombreParam = req.params.nombre;

    // Buscar alumno ignorando mayusculas y minusculas
    const alumno = alumnos.find((a) => a.nombre.toLowerCase() === nombreParam.toLowerCase());

    if (!alumno) {
        return res.status(404).send("Alumno no encontrado");
    }

    // Calculos de datos derivados (no se guardan en el arreglo)
    const suma = alumno.notas[0] + alumno.notas[1] + alumno.notas[2];
    const promedio = suma / 3;

    let condicion = "reprobado";
    if (promedio >= 8) {
        condicion = "promocionado";
    } else if (promedio >= 6) {
        condicion = "aprobado";
    }

    // Se envia la respuesta con los datos almacenados mas los calculados
    res.send({
        nombre: alumno.nombre,
        notas: alumno.notas,
        promedio: promedio,
        condicion: condicion
    });
});

// POST para crear alumno
app.post("/api/alumnos", (req, res) => {
    const { nombre, notas } = req.body;

    if (!nombre || !notas) {
        return res.status(400).send("Faltan datos: nombre y notas son requeridos");
    }

    // Validar formato de notas
    if (!Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).send("Necesita enviar exactamente 3 notas en un arreglo");
    }

    // Validar que las notas sean numeros
    for (let i = 0; i < notas.length; i++) {
        if (isNaN(notas[i]) || notas[i] < 0 || notas[i] > 10) {
            return res.status(400).send("Las notas deben ser numeros validos entre 0 y 10");
        }
    }

    // Validar nombre unico
    const existe = alumnos.find((a) => a.nombre.toLowerCase() === nombre.toLowerCase());
    if (existe) {
        return res.status(400).send("Ya existe un alumno con ese nombre");
    }

    const nuevoAlumno = {
        nombre: nombre,
        notas: notas
    };

    alumnos.push(nuevoAlumno);
    res.status(201).send("Alumno creado exitosamente");
});

// PUT para modificar alumno
app.put("/api/alumnos/:nombre", (req, res) => {
    const nombreParam = req.params.nombre;
    const { nombre: nuevoNombre, notas: nuevasNotas } = req.body;

    const alumnoIndex = alumnos.findIndex((a) => a.nombre.toLowerCase() === nombreParam.toLowerCase());

    if (alumnoIndex === -1) {
        return res.status(404).send("Alumno no encontrado para modificar");
    }

    if (!nuevoNombre || !nuevasNotas) {
        return res.status(400).send("Faltan datos para modificar");
    }

    if (!Array.isArray(nuevasNotas) || nuevasNotas.length !== 3) {
        return res.status(400).send("Debe enviar exactamente 3 notas en un arreglo");
    }

    for (let i = 0; i < nuevasNotas.length; i++) {
        if (isNaN(nuevasNotas[i]) || nuevasNotas[i] < 0 || nuevasNotas[i] > 10) {
            return res.status(400).send("Las notas deben ser numeros validos entre 0 y 10");
        }
    }

    // Validar que el nuevo nombre no pise el de otro alumno existente
    if (nuevoNombre.toLowerCase() !== nombreParam.toLowerCase()) {
        const existeOtro = alumnos.find((a) => a.nombre.toLowerCase() === nuevoNombre.toLowerCase());
        if (existeOtro) {
            return res.status(400).send("Ya existe otro alumno registrado con ese nombre");
        }
    }

    // Actualizacion
    alumnos[alumnoIndex].nombre = nuevoNombre;
    alumnos[alumnoIndex].notas = nuevasNotas;

    res.send("Alumno modificado exitosamente");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});