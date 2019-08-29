"use strict";

class Operations{
    constructor(){
        this.url_array = [];
        this.collect_urls();
    }

    collect_urls(){
        this.urls = {}
        this.urls[`login`] = 'Login';
        this.urls[`avatar`] = 'Avatar';
        this.urls[`update`] = 'Player';
        this.urls[`redeem`] = 'Redemption';
        this.urls[`verify`] = 'Moderation';
        this.urls[`ban`] = 'Moderation';
        this.urls[`unban`] = 'Moderation';
        this.urls[`manage`] = 'Moderation';
        this.urls[`reset`] = 'Reset';
        this.urls[`reset_password`] = 'Reset';

        for(let urls in this.urls){
            this.url_array.push(urls) 
        }
        return this.urls;
    }

    match(request, response, database){
        let url = request.params.link;
        for(let urls in this.urls){
            if(url === urls){           
                let Operation = require(`./${this.urls[urls]}`)
                new Operation(request, response, database).execute();
            }
        }
        return this.handle_urls(url);
    }

    handle_urls(url){
        if(this.url_array.indexOf(url) === -1) 
            return false;
        return true;
    }    
}

module.exports = Operations;