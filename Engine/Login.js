"use strict";


const md5 = require('md5');
const bcrypt = require('bcrypt');

class Login{
    constructor(request, response, engine, type){
        this.response = response;
        this.request = request;
        this.type = type;
        this.engine = engine;
        this.database = engine.database;
    }

    displaySite(){
        if(this.type == 'login_page'){
            return {success_msg: '', error_msg: '', site_key: this.engine.site_key}
        }

        if(this.type == 'incorrect_captcha'){
            return {error_msg : 'The captcha detects you are a bot, please try again.', success_msg: '', site_key: this.engine.site_key}
        }

        if(this.type == 'username_not_found'){
            return {error_msg : 'This username was not found in our records.', success_msg: '', site_key: this.engine.site_key}
        }
        
        if(this.type == 'incorrect_password'){
            return {error_msg : 'The password you entered is incorrect.', success_msg: '', site_key: this.engine.site_key}
        }
    }

    async login(){
        try{
            this.username = this.request.body.username;
            this.password = this.request.body.password;
            let user = await this.database.penguin.findOne({where: {Username: this.username}});
            if(user){
                let password = user.Password.replace(/^\$2y(.+)$/i, '$2a$1');
                if(!await this.checkRow(`Username`, this.username)){
                    this.type = 'username_not_found';
                    this.response.render('index', this.displaySite());
                }
    
                else if(!await bcrypt.compare(await this.getHash(), password)){
                    this.type = 'incorrect_password';
                    this.response.render('index', this.displaySite());
                }
    
                else{
                    this.request.session.loggedin = true;
                    this.request.session.username = this.username;
                    this.response.redirect('/panel');
                }
            }
            else{
                this.type = 'username_not_found';
                this.response.render('index', this.displaySite());
            }
        }
        catch(e){
            console.log(e);
        }
    }

    async getHash(){
        let MD5 = md5(this.password).toUpperCase(); 
        let password = MD5.substr(16, 16) + MD5.substr(0, 16);  
        password += 'houdini'; 
        password += 'Y(02.>\'H}t":E1';
        password = md5(password);
        let hash = password.substr(16, 16) + password.substr(0, 16);
        return hash;
    }


    async checkRow(row, value){
        let userCount = await this.database.penguin.count({ where: {[`${row}`]: [`${value}`]} });
        if (userCount != 0){ 
            return true; 
        }
        else{
            return false;  
        }
    }
}

module.exports = Login;
