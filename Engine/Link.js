"use strict";

const Base = require('../Configuration')
const Displays = require('./Displays')

class Links extends Base{
    constructor(request, response, database){
        super();
        this.params = request.params;
        this.database = database;
        this.response = response;
        this.request = request;
        this.displays = new Displays(request, response, database)
    }

    async identify(){ 
        if(this.request.method === 'GET'){
            let data = await this.displays.get();
            this.handle(data);
        }

        else if (this.request.method === 'POST'){
            let operation = this.operations.match(this.request, this.response, this.database);
            this.handle(operation);
        }

        else{
            let method = false;
            this.handle(method);
        }
    }

    handle(data){
        if(!data && this.params.link == 'avatar' && this.request.method == 'GET' || !data){
            let error = this.displays.find('/error');
            this.response.render(error.page, error.ejs)
        }

        else if(data && this.params.link == 'avatar' && this.request.method == 'GET' || this.request.method == 'POST' && data){
            return;
        }

        else{
            this.response.render(data.page, data.ejs)
        }
    }
}

module.exports = Links;
