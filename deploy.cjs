const firebase = require('firebase-tools');
const path = require('path');

// Cargamos el archivo JSON de forma segura
const serviceAccount = require('./llave.json');

console.log("Iniciando despliegue programático directo e independiente...");

firebase.deploy({
  project: 'iauto-d3a10',
  only: 'hosting:iauto-site',
  cwd: __dirname,
  // Pasamos el objeto de la cuenta de servicio directamente en el parámetro correspondiente
  serviceAccount: serviceAccount 
}).then(() => {
  console.log("¡POR FIN! Proyecto desplegado con éxito en IAUTO.");
}).catch((err) => {
  console.error("Hubo un fallo en el despliegue directo:", err);
});