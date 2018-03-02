const Person = require('./person');

function Crew(personId) {
    Person.call(this, personId);
}

Crew.job = '';
Crew.gender = 0;
Crew.department = '';

Crew.prototype = Object.create(Person.prototype);
Crew.prototype.constructor = Crew;

module.exports = Crew;