"use strict";
const express = require('express');
const bodyparser = require('body-parser');
const flash = require('connect-flash'); 
const path = require('path');
const session = require('express-session');
const nodemailer = require("nodemailer");
const request = require("request");
const log = require('./Console');
const operations = require ('./Engine/Operations')
const crypto = require ('./Engine/Crypto')

class Configuration{
    constructor(){
        this.database_host = 'localhost';
        this.database_username = 'root';
        this.database_password = '';
        this.database_port = 3306;
        this.database_name = 'Houdini';

        this.port = 3000;
        this.site_key = '';
        this.secret_key = '';
        this.session_secret = 'flake';

        this.add_items = 0;
        this.verify_users = 0;
        this.manage_penguins = 0;
        this.redemption = 0;

        this.reset = 1; /* Set this to 1 if you want to use the activate email feature and fill in the below: */
        this.gmail_user = ''; /* Register a new GMAIL account as the email used to send the reset password link, or change the service from GMAIL to your preference.*/
        this.gmail_pass = ''; /* Enter the GMAIL accounts password here*/
        this.cpps_name = 'Flake'; /* The name of your CPPS that will appear in the activation email */
        this.sub_domain = 'manager.flake'; /* The sub-domain that you are using to host the manager, as the link has to be i.e. create.yourcpps.com/activate, if this isn't set properly it'll break the activate account via email feature. It should load from the same subdomain that you use to register i.e. register.cpps.com or create.cpps.com  */
        
        /* Do not touch anything below this unless you know what you are doing */

        this._request = request;
        this.log = log;
        this.nodemailer = nodemailer;
        this.crypto = new crypto();
        this.operations = new operations();
    }

    setup_flake(){
        this.flake = express();
        this.flake.engine('html', require('ejs').renderFile);
        this.flake.set('view engine', 'html'); 
        this.flake.set('views', path.join(__dirname, './views'));
        this.flake.use('/css', express.static(path.join(__dirname, './views/css')));
        this.flake.use('/js', express.static(path.join(__dirname, './views/js')));
        this.flake.use('/img', express.static(path.join(__dirname, './views/img')));
        this.flake.use(bodyparser.urlencoded({extended : true}));
        this.flake.use(bodyparser.json());
        this.flake.use(flash());
        this.flake.use(session({secret: this.session_secret, resave: true, saveUninitialized: true}));
        this.flake.listen(this.port, () => this.log.success(`Running Flake's panel on port: ${this.port}!`))
    }
}


module.exports = Configuration;