const { io } = require('../server');
const { Users } = require('../classes/users');
const { createMessage } = require('../utils/utilities')

const users = new Users();

io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.on('enterChat', (data, callback) => {

        if (!data.name || !data.room) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        client.join(data.room);

        users.addPerson(client.id, data.name, data.room);

        client.broadcast.to(data.room).emit('peopleList', users.getPeopleByRoom(data.room));

        console.log('Usuarios conectados en ' + data.room + ':\n', users.getPeopleByRoom(data.room));

        callback(users.getPeopleByRoom(data.room));
    });

    client.on('createMessage', (data) => {
        let person = users.getPerson(client.id);

        let message = createMessage(person.name, data.message);
        client.broadcast.to(person.room).emit('createMessage', message);
    });

    client.on('disconnect', () => {
        let deletedPerson = users.deletePerson(client.id);

        client.broadcast.to(deletedPerson.room).emit('createMessage', createMessage('Administrador', `${deletedPerson.name} salió`));
        client.broadcast.to(deletedPerson.room).emit('peopleList', users.getPeopleByRoom(deletedPerson.room));
    });

    // Mensajes privados

    client.on('privateMessage', data => {
        let person = users.getPerson(client.id);
        console.log(data);
        client.broadcast.to(data.for).emit('privateMessage', createMessage(person.name, data.message));
    });
});