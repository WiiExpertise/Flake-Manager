const Pages = require('./Pages');
const Sequelize = require('sequelize'); 
const Op = Sequelize.Op;
var Database = require('./DatabaseCon'); 
var Penguin = Database.import('./DataStructure/Penguin');  
var Inventory = Database.import('./DataStructure/Inventory'); 
var Ban = Database.import('./DataStructure/Ban'); 
var bcrypt = require('bcrypt');
var md5 = require(`md5`);


exports.TestDB = async function (){
    try{
        await Database.authenticate();
        console.error('Succesfully connected to the database!');
    }
    catch(e){
        console.error('Check your database details, unable to connect!');
    }
}

exports.Login = async function(username, password, response, request){
    if (await UsernameExists(username)){
        console.log(`This username exists`);
        var UserAccount = await UsernameLocator(username);
        var Password = await CreatePassword(password, type="login");
        bcryptpw = UserAccount.Password.replace(/^\$2y(.+)$/i, '$2a$1');
        const compare = await bcrypt.compare(Password, bcryptpw);
        if(compare){
            request.session.loggedin = true;
            request.session.username = username;
            response.redirect('/panel');
        }
        else{
            response.render('index', Pages.IncorrectPassword());
        }
    }
    else{
        response.render('index', Pages.UsernameDoesNotExist());
    }
}

exports.UpdateInfo = async function (username, email, password, item, response){
    if(!(password || item)){
        await Penguin.update({Email: email}, {where: {Username: username}});
        response.redirect('/panel');
    }
    else if(!(email || item)){
        var DBPassword = await CreatePassword(password, type="create");
        await Penguin.update({Password: DBPassword}, {where: {Username: username}});
        response.redirect('/panel');
    }
    else if (!(email || password)){
        var account = await Penguin.findOne({where: {Username: username}});
        var itemExist = await Inventory.findOne({where: {ItemID: item}});
        if(!itemExist){
            await Inventory.create({PenguinID: account.ID, ItemID: item });
            response.redirect('/panel');
        }
        else{
            response.render('update', Pages.ItemExist());
        }
    }
}

exports.VerifyUser = async function(ID, response){
    await Penguin.update({Approval: 1}, {where: {ID: ID}});
    response.redirect('/verify');
}

exports.Unban = async function(ID, response){
    await Ban.destroy({where: {PenguinID: ID}});
    response.redirect('/unban');
}



async function CreatePassword(password, type){
    var MD5Password = md5(password).toUpperCase(); 
    var hash = MD5Password.substr(16, 16) + MD5Password.substr(0, 16);  
    hash += 'houdini'; 
    hash += 'Y(02.>\'H}t":E1';
    hash = md5(hash);
    hash = hash.substr(16, 16) + hash.substr(0, 16);
    if (type == "login"){
        return hash
    }
    else if(type == "create"){
        finalPw = await bcrypt.hash(hash, 12);
        return finalPw
    }
    else{
        console.log(`Unidentified type of password hash.`)
    }
}



async function UsernameExists(username){ 
    var userCount = await Penguin.count({ where: {'Username': {[Op.eq]:username}} });
        if (userCount != 0){ 
            return true; 
        }
        else{
            return false;  
        }
    }


async function UsernameLocator(username){
    var account = await Penguin.findOne({where: {Username: username}});
    return account
}






