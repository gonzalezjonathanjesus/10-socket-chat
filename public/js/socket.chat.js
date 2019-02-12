var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var user = {
    name: params.get('nombre'),
    room: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('enterChat', user, function(res) {
        renderUsers(res);
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
socket.on('createMessage', function(message) {

    // console.log('Servidor:', mensaje);

    renderMessages(message, false);
    scrollBottom();
});

// Escuchar cambios de usuario
// Cuando un usuario entra o sale del chat
socket.on('peopleList', function(people) {
    renderUsers(people);
});

// Mensajes privados
socket.on('privateMessage', function(message) {
    console.log('Mensaje privado; ', message);
});