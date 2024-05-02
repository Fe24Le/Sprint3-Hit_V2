// load the things we need
var express = require('express');
const fs = require("fs");
var app = express();
const bodyParser = require('body-parser');
//
app.use(express.static('./public'));

app.use(bodyParser.urlencoded({ extended: true }));

// set the view engine to ejs
app.set('view engine', 'ejs');


// index page
app.get('/', function(req, res) {
    res.render('index');
});



// register productDetail
app.get('/productDetail', function(req, res) { 
    res.render('productDetail')
});

// register productCart
app.get('/productCart', function(req, res) { 
    res.render('productCart')
});
// login page
app.get('/login', function(req, res) {
    res.render('login');
});

// register page
app.get('/register', function(req, res) {
    res.render('register');
});

/*----------------seccion login admin -----------------------------*/
// Ruta para manejar el envío del formulario de inicio de sesión
app.post('/login', (req, res) => {
    const { usuario, password } = req.body;
    
    // Verificar las credenciales del administrador (aquí deberías usar una base de datos o algún otro método seguro)
    if (usuario === 'admin' && password === 'admin123') {
        // Si las credenciales son válidas, redirigir al panel de administrador
        res.redirect('adminpage');
    } else {
        // Si las credenciales son inválidas, volver al formulario de inicio de sesión con un mensaje de error
        res.render('login', { error: 'Credenciales incorrectas. Inténtalo de nuevo.' });
    }
});

// // Ruta para el panel de administrador (ejemplo)
// app.get('/admin-panel', (req, res) => {
//     res.send('¡Bienvenido al panel de administrador!');
// });

//admin
app.get('/adminpage', function(req, res) { 
    res.render('adminpage')
});


/*----------------  seccion formulario de admin----------------------*/



app.post('/crear', (req, res) => {
    const nuevoElemento = {
        id: generateId(), // Generar un ID único
        name: req.body.nombre,
        description: req.body.descripcion
    };

    // Leer el archivo JSON y agregar el nuevo elemento
    fs.readFile('datos.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo JSON:', err);
            return;
        }

        const jsonData = JSON.parse(data);
        jsonData.push(nuevoElemento);

        // Escribir de vuelta en el archivo JSON
        fs.writeFile('datos.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error al escribir en el archivo JSON:', err);
                return;
            }
            console.log('Nuevo elemento creado:', nuevoElemento);
            res.redirect('/');
        });
    });
});

// Ruta para actualizar un elemento en el archivo JSON
app.post('/actualizar', (req, res) => {
    const id = req.body.id;
    const nuevoNombre = req.body.nuevoNombre;
    const nuevaDescripcion = req.body.nuevaDescripcion;

    // Leer el archivo JSON y buscar el elemento por su ID
    fs.readFile('datos.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo JSON:', err);
            return;
        }

        const jsonData = JSON.parse(data);
        const elemento = jsonData.find(item => item.id === id);

        // Actualizar los datos del elemento
        if (elemento) {
            if (nuevoNombre) elemento.name = nuevoNombre;
            if (nuevaDescripcion) elemento.description = nuevaDescripcion;

            // Escribir de vuelta en el archivo JSON
            fs.writeFile('datos.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Error al escribir en el archivo JSON:', err);
                    return;
                }
                console.log('Elemento actualizado:', elemento);
                res.redirect('/');
            });
        } else {
            console.error('Elemento no encontrado con ID:', id);
            res.redirect('/');
        }
    });
});

// Ruta para eliminar un elemento del archivo JSON
app.post('/eliminar', (req, res) => {
    const id = req.body.id;

    // Leer el archivo JSON y eliminar el elemento por su ID
    fs.readFile('datos.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo JSON:', err);
            return;
        }

        let jsonData = JSON.parse(data);
        const elementoIndex = jsonData.findIndex(item => item.id === id);

        if (elementoIndex !== -1) {
            const eliminado = jsonData.splice(elementoIndex, 1)[0];

            // Escribir de vuelta en el archivo JSON
            fs.writeFile('datos.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Error al escribir en el archivo JSON:', err);
                    return;
                }
                console.log('Elemento eliminado:', eliminado);
                res.redirect('/');
            });
        } else {
            console.error('Elemento no encontrado con ID:', id);
            res.redirect('/');
        }
    });
});

// Función para generar un ID único
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Iniciar el servidor
// app.listen(port, () => {
//     console.log(`Servidor escuchando en http://localhost:${port} Api funcionando`);
// });

app.listen(8080);
console.log('8080 puerto usado, Api funcionando');
