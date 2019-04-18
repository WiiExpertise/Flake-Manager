const express = require('express');
const bodyparser = require('body-parser');
const flash = require('connect-flash');
const _request = require("request");
const path = require('path');

var session = require('express-session');
const log = require('../Console');
const Panel = require('./Panel');
const Login = require('./Login');
const Avatar = require('./Avatar');
const Database = require('./Database');

class Engine{

    constructor(config){
        /* configuration */
        this.port = config.http.port;
        this.secret_key = config.http.secret_key;
        this.session_secret = config.http.session_secret;
        this.site_key = config.http.site_key;

        /* custom settings */
        this.add_items = config.panel.add_items;
        this.verify_users = config.panel.verify_users;
        this.size = 120;

        this.database = new Database(config);
        this.panel = express();
        this.setup();
        this.listen();
    }

    setup(){
        this.panel.engine('html', require('ejs').renderFile);
        this.panel.set('view engine', 'html'); // reading ejs files 
        this.panel.set('views', path.join(__dirname, '../views'));
        this.panel.use('/css', express.static(path.join(__dirname, '../views/css')));
        this.panel.use('/js', express.static(path.join(__dirname, '../views/js')));
        this.panel.use('/colors', express.static(path.join(__dirname, '../views/colors')));
        this.panel.use(bodyparser.urlencoded({extended : true}));
        this.panel.use(bodyparser.json());
        this.panel.use(flash());
        this.panel.use(session({secret: this.session_secret, resave: true, saveUninitialized: true}));
        this.panel.listen(this.port, () => log.success(`Running the flake panel system on port: ${this.port}!`))
    }

    listen(){
    
        this.panel.get('/', async (request, response) => {
            response.render('index', new Login(request, response, this, 'login_page').displaySite());
        });

        this.panel.post('/', (request, response) => {
            let recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
            recaptcha_url += "secret=" + this.secret_key + "&";
            recaptcha_url += "response=" + request.body.recaptcha_response + "&";
            recaptcha_url += "remoteip=" + request.connection.remoteAddress;
            _request(recaptcha_url, (error, resp, body) => {
                let recaptcha = JSON.parse(body);
                if (recaptcha.success){
                    new Login(request, response, this).login();
                }
                else{
                    response.render('index', new Login(request, response, this, 'incorrect_captcha').displaySite());
                }
            });
        });
        

        this.panel.get('/panel', async (request, response) => {
            if (request.session.loggedin) {
                response.render('panel', await new Panel(request, response, this, request._parsedUrl.pathname).displaySite());
            }
            else {
                response.redirect('/');
            }
        });

        this.panel.post('/update', async (request, response) => {
            await new Panel(request, response, this).updateData();
        });

        this.panel.get('/update_password', async (request, response) => {
            if (request.session.loggedin) {
                response.render('update', await new Panel(request, response, this, request._parsedUrl.pathname).displaySite());
            }
            else {
                response.redirect('/');
            }
        });

        this.panel.get('/update_email', async (request, response) => {
            if (request.session.loggedin) {
                response.render('update', await new Panel(request, response, this, request._parsedUrl.pathname).displaySite());
            }
            else {
                response.redirect('/');
            }
        });

        this.panel.get('/unban', async (request, response) => {
            if (request.session.username){
                let account = await new Panel(request, response, this).getData();
                if(account.Moderator == 1){
                    response.render('update', await new Panel(request, response, this, request._parsedUrl.pathname).displaySite());
                }
                else{
                    response.redirect('/panel');
                }
            }
            else{
                response.redirect('/');
            }
        });

        this.panel.get('/verify', async (request, response) => {
            if (request.session.username){
                let account = await new Panel(request, response, this).getData();
                if(account.Moderator == 1){
                    response.render('update', await new Panel(request, response, this, request._parsedUrl.pathname).displaySite());
                }
                else{
                    response.redirect('/');
                }
            }
            else{
                response.redirect('/');
            }
            
        });

        this.panel.get('/ban', async(request, response) => {
            if (request.session.username){
                let account = await new Panel(request, response, this).getData();
                if(account.Moderator == 1){
                    response.render('update', await new Panel(request, response, this, request._parsedUrl.pathname).displaySite());
                }
                else{
                    response.redirect('/panel');
                }
            }
            else{
                response.redirect('/');
            }
        });

        this.panel.get('/unban/(:id)', async (request, response) => {
            if (request.session.username){
                let account = await new Panel(request, response, this).getData();
                if(account.Moderator == 1){
                    await new Panel(request, response, this).unban()
                }
                else{
                    response.redirect('/panel');
                }
            }
            else{
                response.redirect('/');
            }
        });

        this.panel.post('/ban', async (request, response) => {
            let account = await new Panel(request, response, this).getData();
            if(account.Moderator == 1){
                await new Panel(request, response, this).ban()
            }
            else{
                response.redirect('/panel')
            }
        });

        this.panel.get('/verify/(:id)', async (request, response) => {
            if (request.session.username){
                let account = await new Panel(request, response, this).getData();
                if(account.Moderator == 1){
                    await new Panel(request, response, this).verify()
                }
                else{
                    response.redirect('/panel');
                }
            }
            else{
                response.redirect('/');
            }
        });

        this.panel.get('/add_item', async (request, response) => {
            if(this.add_items == 1){
                if (!request.session.username){
                    response.redirect('/');
                }
                else{
                    response.render('update', await new Panel(request, response, this, request._parsedUrl.pathname).displaySite());
                }
            }
            else{
                response.redirect('/panel');
            }
        });

        this.panel.get('/logout', async (request, response) => {
            request.session.destroy();
            response.redirect('/');
        });

        this.panel.get('/avatar/(:id)', async (request, response) => {
            let penguin = await new Panel(request, response, this).getData();
            const avatar = new Avatar(penguin, this.size);
            let img = await avatar.build()
            response.set('Content-Type', 'image/png');
            response.set('Content-Length', img.length);
            response.end(img);
        });
    }
}

module.exports = Engine;