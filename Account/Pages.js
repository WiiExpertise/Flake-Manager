const CONFIG = require('../Config');
var Panel = require('./Panel');

exports.Blank = function(){
    return { error_msg : '', success_msg: '', site_key: CONFIG.CAPTCHA.SITE_KEY };
}

exports.CaptchaFalse = function(){
    return { error_msg : CONFIG.ERROR_MSGS.CAPTCHA, success_msg: '', site_key: CONFIG.CAPTCHA.SITE_KEY };
}

exports.Success = function(){
    return { success_msg : CONFIG.SUCCESS.COMPLETE, error_msg : '' };
}

exports.Error = function(){
    return { error_msg : CONFIG.ERROR_MSGS.ERROR, success_msg: '' };
}

exports.UsernameDoesNotExist = function(){
    return { error_msg : CONFIG.ERROR_MSGS.USERNAME_NOT_EXIST, success_msg: '', site_key: CONFIG.CAPTCHA.SITE_KEY };
}

exports.BanUsernameDoesntExist = function(){
    return { error_msg : CONFIG.ERROR_MSGS.USERNAME_NOT_EXIST, update_type: 'ban', update_msg: ''};
}


exports.IncorrectPassword = function(){
    return { error_msg : CONFIG.ERROR_MSGS.INCORRECT_PASSWORD, success_msg: '', site_key: CONFIG.CAPTCHA.SITE_KEY };
}

exports.EmailChange = function(){
    return { error_msg : '', update_msg: CONFIG.UPDATE_MSG.EMAIL, update_type: 'email' };
}

exports.Ban = function(){
    return { error_msg : '', update_msg: CONFIG.UPDATE_MSG.BAN, update_type: 'ban' };
}

exports.Unban = function(Bans){
    return { error_msg : '', bans: Bans, update_msg: CONFIG.UPDATE_MSG.UNBAN, update_type: 'unban' };
}


exports.PasswordChange = function(){
    return { error_msg : '', update_msg: CONFIG.UPDATE_MSG.PASSWORD, update_type: 'password' };
}

exports.AddItem = function(){
    return { error_msg : '', update_msg: CONFIG.UPDATE_MSG.ITEM, update_type: 'add_items'};
}

exports.VerifyUsers = function(Approvals){
    return { error_msg : '', approval: Approvals, update_msg: CONFIG.UPDATE_MSG.VERIFY_USERS, update_type: 'verify'};
}

exports.ItemExist = function(){
    return { error_msg : CONFIG.UPDATE_MSG.ITEM_EXISTS, update_msg: '', update_type: 'add_items'};
}

exports.Panel = async function(user){
    var Details = await Panel.UsernameLocator(user);
    return { verify_user: CONFIG.OPTIONS.VERIFY_USERS, add_item: CONFIG.OPTIONS.ADD_ITEMS, panel_type: await Panel.CheckPanelType(Details.Moderator), username: Details.Username, id: Details.ID, email: Details.Email, coins: Details.Coins, active: await Panel.CheckActive(Details.Active), approval: await Panel.CheckApproval(Details.Approval), rank: await Panel.CheckRank(Details.Rank, Details.Moderator), avatar: await Panel.GetClothingString(Details.Username)};
}

