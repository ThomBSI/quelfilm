class Person {

    constructor(personId, personName) {
        /**
         * @type String
         */
        this.personId = personId;
        /**
         * @type String
         */
        this.personName = personName;
        this.profilePath = '';
    }
}
module.exports.Person = Person;