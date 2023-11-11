let datosGlobales;
const tipoRecuento = 1;
const comboPeriodo = document.getElementById('selectPeriodo');
const comboCargo = document.getElementById('selectCargo');
const comboDistrito = document.getElementById('selectDistrito');
const comboSeccion = document.getElementById('selectSeccion');


fetch('https://resultados.mininterior.gob.ar/api/menu/periodos')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error al obtener los datos. Código de estado: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Llena el combo con las opciones obtenidas de la API
    data.forEach(opcion => {
      const opcionElemento = document.createElement('option');
      opcionElemento.value = opcion 
      opcionElemento.text = opcion // esto es lo que se va a mostrar en cada slot de opcion cada vez que se despliegue el combo
      comboPeriodo.add(opcionElemento);
    });
  })
  .catch(error => {
    console.error('Error al obtener datos de la API:', error);
  });

// DE ACA PARA ABAJO CAPAZ PODRÍA IR DENTRO DE UNA FUNCION Y LLAMAR ESA FUNCION DESDE paso.js y generales.js asi se le asigna el tipoEleccion que corresponde a cada uno. capaz estoy batiendo cualquiera tambien

comboPeriodo.addEventListener('change', function () {
    // Verifica si se ha seleccionado una opción
if (comboPeriodo.value) {
        // Hace la solicitud al segundo combo con el valor seleccionado
    comboCargo.innerHTML = ''; // esto es para limpiar los valores del combo
    fetch('https://resultados.mininterior.gob.ar/api/menu?año=' + comboPeriodo.value)
        .then(response => response.json())
        .then(data => {
            datosGlobales = data;
                // Llena el segundo combo con las opciones obtenidas de la API
                // Puedes adaptar esto según la estructura de tu API
            data.forEach(opcion => {
                if (opcion.IdEleccion === tipoEleccion) {
                    opcion.Cargos.forEach(cargo => {
                        const cargoElemento = document.createElement('option');
                        cargoElemento.value = cargo.IdCargo;
                        cargoElemento.text = cargo.Cargo;
                        comboCargo.add(cargoElemento); 
                    })
                }
            });
        })
        .catch(error => {
            console.error('Error al obtener datos del segundo combo:', error);
        });
    }
});

   

// Agrega un evento de cambio al segundo combo (Cargo)
comboCargo.addEventListener('change', function () {
    // Verifica si se ha seleccionado una opción
    if (comboCargo.value) {
        // Limpia las opciones anteriores de los combos de distrito y sección
        comboDistrito.innerHTML = '';

        // Filtra los datos por el cargo seleccionado en el combo
        const cargoSeleccionado = comboCargo.value;
        const datosCargo = datosGlobales.find(eleccion => {
            return eleccion.Cargos.some(cargo => cargo.IdCargo === cargoSeleccionado);
        });

        // Verifica si se encontraron datos para el cargo seleccionado
        if (datosCargo) {
            // Obtiene los datos de los distritos para completar el combo
            datosCargo.Cargos.forEach(cargo => {
                cargo.Distritos.forEach(distrito => {
                    const distritoElemento = document.createElement('option');
                    distritoElemento.value = distrito.IdDistrito;
                    distritoElemento.text = distrito.Distrito;
                    comboDistrito.add(distritoElemento);
                });
            });
        }
    }
});

    // Agrega un evento de cambio al tercer combo (Distrito)
    comboDistrito.addEventListener('change', function () {
        // Verifica si se ha seleccionado una opción
        if (comboDistrito.value) {
            // Limpia las opciones anteriores del combo de sección
            comboSeccion.innerHTML = '';
                                                                                            //LAS OPCIONES DEL COMBO SE QUEDAN EN BLANCO CUANDO SELECCIONAS CARGO, PARECIERA QUE SE BUGGEA Y SE QUEDA EN LA LINEA 94
            // Filtra los datos por el distrito seleccionado en el combo
            const distritoSeleccionado = comboDistrito.value;
            datosGlobales.forEach(eleccion => {
                eleccion.Cargos.forEach(cargo => {
                    cargo.Distritos.forEach(distrito => {
                        if (distrito.IdDistrito === distritoSeleccionado) {
                            // Guarda el valor de IdSeccionProvincial en el campo oculto
                            hdSeccionProvincial.value = distrito.IdSeccionProvincial;

                            // Obtiene los datos de las secciones para completar el combo
                            distrito.SeccionesProvinciales.forEach(seccionProvincial => {
                                seccionProvincial.Secciones.forEach(seccion => {
                                    const seccionElemento = document.createElement('option');
                                    seccionElemento.value = seccion.IdSeccion;
                                    seccionElemento.text = seccion.Seccion;
                                    comboSeccion.add(seccionElemento);
                                });
                            });

                            // Muestra el combo de sección si no está visible
                            if (comboSeccion.style.display === 'none') {
                                comboSeccion.style.display = 'block';
                            }
                        }
                    });
                });
            });
        } else {
            // Oculta el combo de sección si no hay distrito seleccionado
            comboSeccion.style.display = 'none';
        }
    });