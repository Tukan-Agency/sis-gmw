const fs = require('fs');
const path = require('path');

function jsoncreate(url_app) {
  // Crear el objeto con la estructura deseada
  const data = {
    urlapp: url_app
  };

  // Convertir el objeto a formato JSON
  const jsonData = JSON.stringify(data, null, 2); // null y 2 son para formatear el JSON

  // Ruta donde se generará el archivo JSON
  const filePath = path.join(__dirname, '../public', 'urlapp.json');

  // Escribir el archivo JSON en la ruta especificada
  fs.writeFile(filePath, jsonData, 'utf8', (err) => {
    if (err) {
      console.error('Error al escribir el archivo:', err);
      return;
    }
    console.log('El archivo JSON ha sido generado correctamente en:', filePath);
  });
}

module.exports = jsoncreate;
