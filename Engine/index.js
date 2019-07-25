const express = require('express');
const bodyparser = require('body-parser');
const flash = require('connect-flash');
const _request = require("request");
const path = require('path');
const session = require('express-session');

const Log = require('../Console');
const Panel = require('./Panel');
const Login = require('./Login');
const Avatar = require('./Avatar');
const Database = require('./Database');

class Engine{

    constructor(config){
        this.port = config.http.port;
        this.secret_key = config.http.secret_key;
        this.session_secret = config.http.session_secret;
        this.site_key = config.http.site_key;
        this.add_items = config.panel.add_items;
        this.verify_users = config.panel.verify_users;
        this.manage_penguins = config.panel.manage_penguins;
        this.redemption = config.panel.redemption;
        this.reset = config.reset_password_mail.reset_password;
        this.gmail_user = config.reset_password_mail.gmail_user;
        this.gmail_pass = config.reset_password_mail.gmail_pass;
        this.domain = config.reset_password_mail.sub_domain;
        this.cpps_name = config.reset_password_mail.cpps_name;
        this.size = 120;
        this.database = new Database(config);
        this.panel = express();
        this.setup();
        this.listen();
    }

    setup(){
        this.panel.engine('html', require('ejs').renderFile);
        this.panel.set('view engine', 'html'); 
        this.panel.set('views', path.join(__dirname, '../views'));
        this.panel.use('/css', express.static(path.join(__dirname, '../views/css')));
        this.panel.use('/js', express.static(path.join(__dirname, '../views/js')));
        this.panel.use(bodyparser.urlencoded({extended : true}));
        this.panel.use(bodyparser.json());
        this.panel.use(flash());
        this.panel.use(session({secret: this.session_secret, resave: true, saveUninitialized: true}));
        this.panel.listen(this.port, () => Log.success(`Running the flake panel system on port: ${this.port}!`))
    }

    listen(){
    
        this.panel.get('/', async (request, response) => {
            response.render('index', new Login(request, response, this, 'login_page').displaySite());
        });

        this.panel.get('/panel', async (request, response) => {
            if (request.session.loggedin) {
                response.render('panel', await new Panel(request, response, this, request._parsedUrl.pathname).displaySite());
            }
            else {
                response.redirect('/');
            }
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

        this.panel.get('/redemption', async (request, response) => {
            if (request.session.loggedin) {
                response.render('update', await new Panel(request, response, this, request._parsedUrl.pathname).displaySite());
            }
            else {
                response.redirect('/');
            }
        });

        this.panel.get('/reset', async (request, response) => {
            if(this.reset == 1){
                response.render('update', await new Panel(request, response, this, request._parsedUrl.pathname).displaySite());
            }
            else{
                response.redirect('/')
            }
        });

        this.panel.get('/reset/(:id)', async (request, response) => {
            if(this.reset == 1){
                let expiry = await new Panel(request, response, this).password_reset_expiry();
                if(expiry){
                    response.render('update', await new Panel(request, response, this, 'choose_password').displaySite());
                }
                else{
                    response.render('update', await new Panel(request, response, this, 'expiry').displaySite());
                }
            }
            else{
                response.redirect('/')
            }
        });

        this.panel.post('/reset_password/(:id)', async (request, response) => {
            if(this.reset == 1){
                await new Panel(request, response, this).reset()
            }
            else{
                response.redirect('/')
            }
        });

        this.panel.get('/unban', async (request, response) => {
            if (request.session.username){
                let account = await new Panel(request, response, this).getByUsername();
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

        this.panel.get('/manage', async (request, response) => {
            if (request.session.username){
                let account = await new Panel(request, response, this).getByUsername();
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
                let account = await new Panel(request, response, this).getByUsername();
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
                let account = await new Panel(request, response, this).getByUsername();
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
                let account = await new Panel(request, response, this).getByUsername();
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

        this.panel.get('/manage/(:id)', async (request, response) => {
            if (request.session.username){
                let account = await new Panel(request, response, this).getByUsername();
                if(account.Moderator == 1){
                    response.render('update', await new Panel(request, response, this, 'manage_penguin').displaySite());
                }
                else{
                    response.redirect('/panel');
                }
            }
            else{
                response.redirect('/');
            }
        });

        this.panel.get('/manage/edit/(:type)/(:id)', async (request, response) => {
            if (request.session.username){
                let account = await new Panel(request, response, this).getByUsername();
                if(account.Moderator == 1){
                    await new Panel(request, response, this).edit();
                }
                else{
                    response.redirect('/panel');
                }
            }
            else{
                response.redirect('/');
            }
        });

        this.panel.get('/verify/(:id)', async (request, response) => {
            if (request.session.username){
                let account = await new Panel(request, response, this).getByUsername();
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
            let penguin = await new Panel(request, response, this).getById();
            const avatar = new Avatar(penguin, this.size);
            let img = await avatar.build()
            response.set('Content-Type', 'image/png');
            response.set('Content-Length', img.length);
            response.end(img);
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

        this.panel.post('/redeem', async (request, response) => {
            await new Panel(request, response, this).redeem();
        });

        this.panel.post('/update', async (request, response) => {
            await new Panel(request, response, this).updateData();
        });

        this.panel.post('/reset', async (request, response) => {
            await new Panel(request, response, this).send_reset();
        });

        this.panel.post('/manage/update/(:type)/(:id)', async (request, response) => {
            await new Panel(request, response, this).playerUpdateData();
        });
    
        this.panel.post('/ban', async (request, response) => {
            let account = await new Panel(request, response, this).getByUsername();
            if(account.Moderator == 1){
                await new Panel(request, response, this).ban()
            }
            else{
                response.redirect('/panel')
            }
        });
    }
}

module.exports = Engine;
