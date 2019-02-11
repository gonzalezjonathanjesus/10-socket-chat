class Users {

    constructor() {
        this.people = [];
    }

    addPerson(id, name, room) {
        let person = { id, name, room };

        this.people.push(person);

        return this.people;
    }

    getPerson(id) {
        let person = this.people.filter((person) => {
            return person.id === id;
        })[0];

        return person;
    }

    getPeople() {
        return this.people;
    }

    getPeopleByRoom(room) {
        // ...
    }

    deletePerson(id) {
        let deletedPerson = this.getPerson(id); // Reference of the person that we will delete

        this.people = this.people.filter((person) => {
            return person.id != id;
        });

        return deletedPerson;
    }
}

module.exports = {
    Users
};