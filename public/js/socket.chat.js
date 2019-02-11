var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var user = {
    name: params.get('name'),
    room: params.get('room')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('enterChat', user, function(res) {
        console.log('Usuarios conectados', res);
    });
});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});


// Enviar información
// socket.emit('createMessage', {
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('createMessage', function(mensaje) {

    console.log('Servidor:', mensaje);

});

// Escuchar cambios de usuario
// Cuando un usuario entra o sale del chat
socket.on('peopleList', function(people) {

    console.log(people);

});

// Mensajes privados
socket.on('privateMessage', function(message) {
    console.log('Mensaje privado; ', message);
});