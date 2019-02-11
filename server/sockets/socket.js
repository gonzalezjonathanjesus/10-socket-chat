const { io } = require('../server');
const { Users } = require('../classes/users');
const { createMessage } = require('../utils/utilities')

const users = new Users();

io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.on('enterChat', (data, callback) => {

        console.log(data);
        if (!data.name || !data.room) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        client.join(data.room);

        let people = users.addPerson(client.id, data.name, data.room);

        client.broadcast.emit('peopleList', users.getPeople());

        callback(people);
    });

    client.on('createMessage', (data) => {
        let person = users.getPerson(client.id);

        let message = createMessage(person.name, data.message);
        client.broadcast.emit('createMessage', message);
    });

    client.on('disconnect', () => {
        let deletedPerson = users.deletePerson(client.id);

        client.broadcast.emit('createMessage', createMessage('Administrador', `${deletedPerson.name} salió`));
        client.broadcast.emit('peopleList', users.getPeople());
    });

    // Mensajes privados

    client.on('privateMessage', data => {
        let person = users.getPerson(client.id);
        client.broadcast.to(data.for).emit('privateMessage', createMessage(person.name, data.message));
    });
});