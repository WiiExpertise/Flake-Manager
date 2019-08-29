
const Link = require('./Link');
const Base = require('../Configuration');
const Database = require('./Database');

class Engine extends Base{

    constructor(){
        super().setup_flake();
        this.database = new Database();
        this.database.connect();
        this.listen();
    }

    listen(){
        
        this.flake.get('/', (request, response) => {
            new Link(request, response, this.database).identify();
        });

        this.flake.get(`/(:link)/`, (request, response) => {
            new Link(request, response, this.database).identify();
        });

        this.flake.post(`/(:link)/`, (request, response) => {
            new Link(request, response, this.database).identify();
        });

        this.flake.get(`/(:link)/(:value)/`, (request, response) => {
            new Link(request, response, this.database).identify();
        });

        this.flake.post(`/(:link)/(:value)/`, (request, response) => {
            new Link(request, response, this.database).identify();
        });

        this.flake.get(`/(:value)/(:type)/(:id)/`, (request, response) => {
            new Link(request, response, this.database).identify();
        });

        this.flake.post(`/(:link)/(:value)/(:type)/(:id)/`, (request, response) => {
            new Link(request, response, this.database).identify();
        });

    }
}

module.exports = Engine;
