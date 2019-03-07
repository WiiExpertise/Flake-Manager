const express = require('express');
var Account = require('./Account/Account');
const Avatar = require('./Account/Avatar');
const Pages = require('./Account/Pages');
const Panel = require('./Account/Panel');
const CONFIG = require('./Config');
var session = require('express-session');
var BodyParser = require('body-parser');
var Flash = require('connect-flash');
var Request = require("request");
const flake = express();

// all code by ro :~) 

flake.engine('html', require('ejs').renderFile);
flake.set('view engine', 'html');
flake.use('/css_js', express.static(__dirname + '/views/css_js'));
flake.use(BodyParser.urlencoded({extended : true}));
flake.use(BodyParser.json());
flake.use(Flash());
flake.use(session({
	secret: CONFIG.HTTP.SESSION_SECRET,
	resave: true,
	saveUninitialized: true
}));

flake.post('/', async function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    var recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
    recaptcha_url += "secret=" + CONFIG.CAPTCHA.SECRET_KEY + "&";
    recaptcha_url += "response=" + request.body.recaptcha_response + "&";
    recaptcha_url += "remoteip=" + request.connection.remoteAddress;
    Request(recaptcha_url, function(error, resp, body) { 
    var recaptcha = JSON.parse(body);
    if (recaptcha.success){
        Account.Login(username, password, response, request);
    }
    else{
        response.render('index', Pages.CaptchaFalse());
    }
});
});

flake.post('/update', async function(request, response) {
    var username = request.session.username;
    var password = request.body.password;
    var email = request.body.email;
    var item = request.body.item;
    if(email){
        password = false; 
        item = false;
        await Account.UpdateInfo(username, email, password, item, response);
    }
    else if(password){
        email = false;
        item = false;
        await Account.UpdateInfo(username, email, password, item, response);
    }
    else if(item){
        email = false;
        password = false;
        await Account.UpdateInfo(username, email, password, item, response);
    }
});

flake.post('/ban', async function(request, response) {
    var moderator = request.session.username;
    var username = request.body.username;
    var hours = request.body.hours;
    var reason = request.body.reason;
    var userExist = await Panel.UsernameLocator(username);
    if(userExist){
        await Panel.Ban(username, hours, reason, moderator, response);
    }
    else{
        response.render('update', Pages.BanUsernameDoesntExist());
    }
});

flake.get('/verify/(:id)', async function(request, response) {
    if (request.session.username){
        var account = await Panel.UsernameLocator(request.session.username);
        if(account.Moderator == 1){
            var ID = request.params.id;
            await Account.VerifyUser(ID, response)
        }
        else{
            response.redirect('/panel');
        }
    }
    else{
        response.redirect('/');
    }
});

flake.get('/unban/(:id)', async function(request, response) {
    if (request.session.username){
        var account = await Panel.UsernameLocator(request.session.username);
        if(account.Moderator == 1){
            var ID = request.params.id;
            await Account.Unban(ID, response)
        }
        else{
            response.redirect('/panel');
        }
    }
    else{
        response.redirect('/');
    }
});

flake.get('/ban', async function(request, response) {
    if (request.session.username){
        var account = await Panel.UsernameLocator(request.session.username);
        if(account.Moderator == 1){
            response.render('update', Pages.Ban());
        }
        else{
            response.redirect('/panel');
        }
    }
    else{
        response.redirect('/');
    }
});



flake.get('/', function(request, response) {
    response.render('index', Pages.Blank());
    response.end();
});

flake.get('/UpdateEmail', function(request, response) {
    if (!request.session.username){
        response.redirect('/');
    }
    else{
        response.render('update', Pages.EmailChange());
        response.end();
    }
});

flake.get('/verify', async function(request, response) {
    if (request.session.username){
        var account = await Panel.UsernameLocator(request.session.username);
        if(account.Moderator == 1){
            var Approvals = await Panel.GetApprovals();
            response.render('update', Pages.VerifyUsers(Approvals));
            response.end();
        }
        else{
            response.redirect('/');
        }
    }
    else{
        response.redirect('/');
    }
    
});

flake.get('/unban', async function(request, response) {
    if (request.session.username){
        var account = await Panel.UsernameLocator(request.session.username);
        if(account.Moderator == 1){
            var Bans = await Panel.GetBans();
            response.render('update', Pages.Unban(Bans));
            response.end();
        }
        else{
            response.redirect('/');
        }
    }
    else{
        response.redirect('/');
    }
    
});

flake.get('/AddItem', function(request, response) {
    if(CONFIG.OPTIONS.ADD_ITEMS == 1){
        if (!request.session.username){
            response.redirect('/');
        }
        else{
            response.render('update', Pages.AddItem());
            response.end();
        }
    }
    else{
        response.redirect('/panel');
    }
});

flake.get('/UpdatePassword', function(request, response) {
    if (!request.session.username){
        response.redirect('/');
    }
    else{
        response.render('update', Pages.PasswordChange());
        response.end();
    }
});

flake.get('/logout', function(request, response) {
    request.session.destroy();
    response.redirect('/');
});


flake.get('/panel', async function(request, response) {
    if (request.session.loggedin) {
        response.render('panel', await Pages.Panel(request.session.username));
	} else {
		response.redirect('/');
	}
});

flake.get('/avatar/(:id)', async function(request, response) {
    var ID = request.params.id;
    var size = 120;
    var penguin = await Panel.IDLocator(ID);
    const avatar = new Avatar(penguin, size);
    var img = await avatar.build()
    response.set('Content-Type', 'image/png');
    response.set('Content-Length', img.length);
    response.end(img);
});

flake.listen(CONFIG.HTTP.ACCOUNT, () => console.log(`RUNNING FLAKE MANAGER SYSTEM ON PORT: ${CONFIG.HTTP.ACCOUNT}!`));

Account.TestDB()
