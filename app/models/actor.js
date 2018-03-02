const Person = require('./person');

function Actor(personId) {
    Person.call(this. personId);
}

Actor.profilePath = '';

Actor.prototype = Object.create(Person.prototype);
Actor.prototype.constructor = Actor;

module.exports = Actor;