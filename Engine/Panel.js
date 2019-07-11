const md5 = require('md5');
const bcrypt = require('bcrypt');

class Panel{
    constructor(request, response, engine, type){
        this.response = response;
        this.request = request;
        this.username = request.session.username;
        this.id = request.params.id;
        this.row = request.params.type;
        this.password = request.body.password;
        this.email = request.body.email;
        this.item = request.body.item;
        this.bannedUsername = request.body.username;
        this.hours = request.body.hours;
        this.reason = request.body.reason;
        this.data = request.body.player_data;
        this.code = request.body.code;
        this.link = request._parsedUrl.pathname;
        this.engine = engine;
        this.database = engine.database;
        this.type = type;
        this.add_items = engine.add_items;
        this.verify_users = engine.verify_users;
        this.manage_penguins = engine.manage_penguins;
        this.redemption = engine.redemption;
    }

    async displaySite(){
        if(this.type == '/panel' || this.type == '/panel/'){
            this.user = await this.getByUsername();
            return {success_msg: '', error_msg: '', redemption: this.redemption, manage_penguins: this.manage_penguins, verify_user: this.verify_users, add_item: this.add_items, id: this.user.ID, username: this.user.Username, approval: this.boolean(this.user.Approval), active: this.boolean(this.user.Active), email: this.user.Email, coins: this.user.Coins, rank: this.user.Rank, panel_type: this.user.Moderator, site_key: this.engine.site_key}
        }

        if(this.type == '/update_password' || this.type == '/update_password/'){
            return {error_msg : '', update_msg: 'Please enter a new password for your penguin.', update_type: 'password'}
        }

        if(this.type == '/redemption' || this.type == '/redemption/'){
            return {error_msg : '', update_msg: 'Please enter the redemption code.', update_type: 'redemption'}
        }

        if(this.type == 'manage_penguin'){
            this.user = await this.getById();
            return{error_msg: '', update_msg: `Update certain settings for the user: ${this.user.Username}`, approval: this.boolean(this.user.Approval), moderator: this.boolean(this.user.Moderator), active: this.boolean(this.user.Active), penguin: this.user, update_type: 'manage_penguin'}
        }

        if(this.type == '/update_email' || this.type == '/update_email/'){
            return {error_msg : '', update_msg: 'Please enter a new email for your penguin.', update_type: 'email'}
        }

        if(this.type == '/add_item' || this.type == '/add_item/'){
            return{error_msg : '', update_msg: 'Please enter a valid Item ID to add to your penguin.', update_type: 'add_item'}
        }

        if(this.type == '/unban' || this.type == '/unban/'){
            return{ error_msg : '', bans: await this.bannedData(), update_msg: 'Choose users to unban', update_type: 'unban' };
        }
        if(this.type == '/manage' || this.type == '/manage/'){
            return{error_msg: '', update_msg: 'Click a player you want to manage', update_type: 'manage', penguin: await this.getAllPenguins()}
        }
        if(this.type == '/verify' || this.type == '/verify/'){
            return{ error_msg : '', approval: await this.getApprovals(), update_msg: 'Verify a users username to be approved in-game', update_type: 'verify'};
        }

        if(this.type == '/ban' || this.type == '/ban/'){
            return { error_msg : '', update_msg: 'Provide a ban for a user.', update_type: 'ban' };
        }

        if(this.type == 'item_exist'){
            return{error_msg : 'This item is already in your inventory!', update_msg: '', update_type: 'add_item'}
        }

        if(this.type == 'username_not_found'){
            return{error_msg : 'This username was not found.', update_msg: '', update_type: 'ban'}
        }

        if(this.type == 'error'){
            this.user = await this.getById();
            return{error_msg : 'Something went wrong, please try again!', row: this.row, id: this.user.ID, update_msg:``, update_type: 'edit_field'}
        }

        if(this.type == 'edit_field'){
            this.user = await this.getById();
            return{error_msg: '', row: this.row, id: this.user.ID, update_msg:`Enter the new value for the row: '${this.row}' for the penguin: '${this.user.Username}'`, update_type: 'edit_field'}
        }

        if(this.type == 'code_not_exist'){
            return{error_msg:'This code was not found in our records', update_msg: '', update_type: 'redemption'}
        }

        if(this.type == 'already_redeemed'){
            return{error_msg:'This code was already redeemed by you.', update_msg: '', update_type: 'redemption'}
        }

        if(this.type == 'outdated_code'){
            return{error_msg:'This code is out of date, sorry!', update_msg: '', update_type: 'redemption'}
        }

        if(this.type == 'redeemed'){
            return{error_msg:'', update_msg: `Congratulations, you just redeemed ${this.code}!`, update_type: 'redemption'}
        }

    }

    async getApprovals(){
        return await this.database.penguin.findAll({where: {Approval: 0}});
    }

    async getAllPenguins(){
        return await this.database.penguin.findAll({where: {Moderator: { $not: 1}}});
    }

    async bannedData(){
        let bannedData = [];
        let bans = await this.database.ban.findAll({})
        for(let player in bans){
            let penguin = await this.database.penguin.findAll({where: {ID: bans[player].PenguinID}});
            for(let penguinData in penguin){
                bans[player].Username = penguin[penguinData].Username;
                bannedData.push(bans[player]);
            }
        }
        return bannedData;
    }

    async ban(){
        if(await this.checkBanExistance()){
            let banned = await this.database.penguin.findOne({where: {Username: this.bannedUsername}});
            this.user = await this.getByUsername();
            let date = new Date().getTime();
            date += (this.hours * 60 * 60 * 1000);
            await this.database.ban.create({PenguinID: banned.ID, ModeratorID: this.user.ID, Reason: 0, Comment: this.reason, Expires: date});
            this.response.redirect('/ban');
        }
        else{
            this.type = 'username_not_found';
            this.response.render('update', await this.displaySite());
        }
    }

    async verify(){
        if(this.id){
            await this.database.penguin.update({Approval: 1}, {where: {ID: this.id}});
            this.response.redirect('/verify');
        }
    }

    async unban(){
        if(this.id){
            await this.database.ban.destroy({where: {PenguinID: this.id}});
            this.response.redirect('/unban');
        }
    }

    async updateData(){
        if(this.password){
            let password = await this.bcrypt(this.password);
            await this.database.penguin.update({Password: password}, {where: {Username: this.username}});
            this.response.redirect('/panel');

        }

        else if(this.email){
            await this.database.penguin.update({Email: this.email}, {where: {Username: this.username}});
            this.response.redirect('/panel');
        }

        else if(this.item){
            this.addItem();
        }
    }

    async addItem(){
        if(await this.itemExist()){
            this.type = 'item_exist';
            this.response.render('update', await this.displaySite());
        }
        else{
            await this.database.inventory.create({PenguinID: this.user.ID, ItemID: this.item });
            this.response.redirect('/add_item');
        }
    }

    async itemExist(){
        let items = [];
        this.user = await this.getByUsername();
        let userItems = await this.database.inventory.findAll({where: {PenguinID: this.user.ID}});
        for(let ID in userItems){
            items.push(userItems[ID].ItemID)
        }
        if(items.indexOf(Number(this.item)) == -1){
            return false;
        }
        else{
            return true;
        }
    }
    
    async redeem(){
        this.user = await this.getByUsername();
        let code = await this.database.redemption_code.findOne({where: {Code: this.code}}); 
        let codesRedeemed = await this.database.penguin_redemption.findAll({where: {PenguinID: this.user.ID}}); 
        if(await this.codeExists(code)){
            if(await this.checkIfRedeemed(codesRedeemed, code)){
                if(await this.checkExpiry(code)){
                    let addedCoins = this.user.Coins + code.Coins
                    await this.database.penguin_redemption.create({PenguinID: this.user.ID, CodeID: code.ID});
                    await this.database.penguin.update({Coins: addedCoins}, {where: {ID: this.user.ID}});
                    this.type = 'redeemed';
                    this.response.render('update', await this.displaySite());
                }
            }
        }
    }

    async checkExpiry(code){
        if(code.Expires < new Date().getTime()){
            this.type = 'outdated_code';
            this.response.render('update', await this.displaySite());
            return false;
        }
        else{
            return true;
        }
    }

    async checkIfRedeemed(codesRedeemed, code){
        let codes = [];
        for(let ID in codesRedeemed){ 
            codes.push(codesRedeemed[ID].CodeID)
        }
        if(codes.indexOf(Number(code.ID)) == -1){ 
            return true;
        }
        else{
            this.type = 'already_redeemed';
            this.response.render('update', await this.displaySite());
            return false;
        }
    }

    async codeExists(code){
        if(code){
            return true;
        }
        else{
            this.type = 'code_not_exist';
            this.response.render('update', await this.displaySite());
            return false;
        }
    }

    async bcrypt(givenPassword){
        let MD5 = md5(givenPassword).toUpperCase(); 
        let password = MD5.substr(16, 16) + MD5.substr(0, 16);  
        password += 'houdini'; 
        password += 'Y(02.>\'H}t":E1';
        password = md5(password);
        password = password.substr(16, 16) + password.substr(0, 16);
        let bcryptPassword = await bcrypt.hash(password, 12);
        return bcryptPassword;
    }

    boolean(data){
        if(data == 1){
            return 'Yes';
        }
        else{
            return 'No';
        }
    }
    
    async edit(){
        if(this.row == 'Approval' || this.row == 'Active' || this.row == 'Moderator'){
            await this.handleChange();
        }
        else{
            this.type = 'edit_field';
            this.response.render('update', await this.displaySite());
        }
    }

    async playerUpdateData(){
        if(this.row == 'Password'){
            this.data = await this.bcrypt(this.data);
        }
        else if(this.row == 'ID'){
            this.response.redirect(`/manage/${this.id}`)
        }
        try{
            await this.database.penguin.update({[`${this.row}`]: this.data}, {where: {ID: this.id}});
        }
        catch{
            this.type = 'error';
            this.response.render('update', await this.displaySite());
        }
        this.response.redirect(`/manage/${this.id}`)
    }

    async handleChange(){
        let penguin = await this.database.penguin.findOne({where: {ID: this.id}});
        if(this.row == 'Approval'){
            await this.handleBooleanChange(penguin.Approval)
        }
        else if(this.row == 'Active'){
            await this.handleBooleanChange(penguin.Active)
        }
        else{
            await this.handleBooleanChange(penguin.Moderator);
        }
        this.response.redirect(`/manage/${this.id}`)
    }

    async handleBooleanChange(value){
        if(value == 1){
            await this.database.penguin.update({[`${this.row}`]: 0}, {where: {ID: this.id}});
        }
        else{
            await this.database.penguin.update({[`${this.row}`]: 1}, {where: {ID: this.id}});
        }
    }


    async checkBanExistance(){
        let user = await this.database.penguin.findOne({where: {Username: this.bannedUsername}});
        if(user){
            return true;
        }
    }


    async getByUsername(){
        if(this.username){
            let user = await this.database.penguin.findOne({where: {Username: this.username}});
            return user;
        }
    }

    async getById(){
        let user = await this.database.penguin.findOne({where: {ID: this.id}});
        return user;
    }
}

module.exports = Panel;
