var Database = require('./DatabaseCon'); 
var Penguin = Database.import('./DataStructure/Penguin');  
var Ban = Database.import('./DataStructure/Ban');

exports.UsernameLocator = async function (username){
    var account = await Penguin.findOne({where: {Username: username}});
    return account
}

exports.GetApprovals = async function(){
    var approvals = await Penguin.findAll({where: {Approval: 0}});
    return approvals;
}

exports.GetBans = async function(){
    var bans = await Ban.findAll({});
    return bans;
}


exports.Ban = async function(username, hours, reason, moderator, response){
    var account = await Penguin.findOne({where: {Username: username}});
    var moderator = await Penguin.findOne({where: {Username: moderator}});
    var banHours = new Date();
    banHours.setHours(banHours.getHours() + hours);
    console.log(banHours);
    await Ban.create({PenguinID: account.ID, ModeratorID: moderator.ID, Reason: 0, Comment: reason, Expires: banHours});
    response.redirect('/panel');
}


exports.CheckRank = async function (rank){
    if (rank == 0){
        return 'Member';
    }
    if (rank == 1){
        return 'Member';
    }
    if (rank == 3){
        return 'Moderator';
    }
    if (rank == 5){
        return 'Administrator';
    }
    else{ // o.O
        return 'Member';
    }
}

exports.CheckPanelType = async function (moderator){
    if (moderator == 1){
        return true;
    }
    else{
        return false;
    }
}


exports.CheckActive = async function (active){
    if (active == 0){
        return 'No';
    }
    else if (active == 1){
        return 'Yes';
    }
    else{ // oh no
        return '?'; 
    }
}

exports.CheckApproval = async function (approve){
    if (approve == 0){
        return 'No';
    }
    else if (approve == 1){
        return 'Yes';
    }
    else{ // ?
        return '?'; 
    }
}

exports.GetClothingString = async function (username){
    var account = await Penguin.findOne({where: {Username: username}});
    var clothingStr = parse('color=%s&head=%s&face=%s&neck=%s&body=%s&hand=%s&feet=%s', account.Color, account.Head, account.Face, account.Neck, account.Body, account.Hand, account.Feet);
    return clothingStr;
}

function parse(str) {
    var args = [].slice.call(arguments, 1), // sorry, just so used to using %s in python :^(
        i = 0;

    return str.replace(/%s/g, () => args[i++]);
}
