import Jasmine from 'jasmine';

let jasmine = new Jasmine();
jasmine.loadConfigFile('./support/jasmine.json');
jasmine.execute();