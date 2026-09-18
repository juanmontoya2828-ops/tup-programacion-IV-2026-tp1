const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// GET para entregar geometria del rectangulo (usando req.params)
app.get("/api/rectangulos/:ancho/:alto", (req, res) => {
    // Extraigo el ancho y alto de los parametros de la ruta
    const ancho = Number(req.params.ancho);
    const alto = Number(req.params.alto);

    // Validar dimensiones (solo si son numeros positivos)
    if (isNaN(ancho) || ancho <= 0 || isNaN(alto) || alto <= 0) {
        return res.status(400).send("Dimensiones invalidas. Las mismas deben ser mayores a 0");
    }

    // Calculos
    const perimetro = 2 * (ancho + alto);
    const superficie = ancho * alto;
    const esCuadrado = ancho === alto;

    res.send({
        ancho: ancho,
        alto: alto,
        perimetro: perimetro,
        superficie: superficie,
        esCuadrado: esCuadrado
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});