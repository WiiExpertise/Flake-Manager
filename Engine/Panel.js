const md5 = require('md5');
const bcrypt = require('bcrypt');

class Panel{
    constructor(request, response, engine, type){
        this.response = response;
        this.request = request;
        this.id = request.params.id;
        this.username = request.session.username;
        this.password = request.body.password;
        this.email = request.body.email;
        this.item = request.body.item;
        // this.username => this.moderator = request.session.username;
        this.bannedUsername = request.body.username;
        this.hours = request.body.hours;
        this.reason = request.body.reason;
        this.engine = engine;
        this.database = engine.database;
        this.type = type;
        this.add_items = engine.add_items;
        this.verify_users = engine.verify_users;
    }

    async displaySite(){
        if(this.type == '/panel'){
            this.user = await this.getData();
            return {success_msg: '', error_msg: '', verify_user: this.verify_users, add_item: this.add_items, id: this.user.ID, username: this.user.Username, approval: this.boolean(this.user.Approval), active: this.boolean(this.user.Active), email: this.user.Email, coins: this.user.Coins, rank: this.user.Rank, panel_type: this.user.Moderator, site_key: this.engine.site_key}
        }

        if(this.type == '/update_password'){
            return {error_msg : '', update_msg: 'Please enter a new password for your penguin.', update_type: 'password'}
        }

        if(this.type == '/update_email'){
            return {error_msg : '', update_msg: 'Please enter a new email for your penguin.', update_type: 'email'}
        }

        if(this.type == '/add_item'){
            return{error_msg : '', update_msg: 'Please enter a valid Item ID to add to your penguin.', update_type: 'add_item'}
        }

        if(this.type == '/unban'){
            return{ error_msg : '', bans: await this.getBans(), update_msg: 'Choose users to unban', update_type: 'unban' };
        }

        if(this.type == '/verify'){
            return{ error_msg : '', approval: await this.getApprovals(), update_msg: 'Verify a users username to be approved in-game', update_type: 'verify'};
        }

        if(this.type == '/ban'){
            return { error_msg : '', update_msg: 'Provide a ban for a user.', update_type: 'ban' };
        }

        if(this.type == 'item_exist'){
            return{error_msg : 'This item is already in your inventory!', update_msg: '', update_type: 'add_item'}
        }

        if(this.type == 'username_not_found'){
            return{error_msg : 'This username was not found.', update_msg: '', update_type: 'ban'}
        }
    }

    async getApprovals(){
        return await this.database.penguin.findAll({where: {Approval: 0}});
    }

    async getBans(){
        return await this.database.ban.findAll({});
    }

    async ban(){
        if(await this.checkBanExistance()){
            let banned = await this.database.penguin.findOne({where: {Username: this.bannedUsername}});
            this.user = await this.getData();
            let banHours = new Date();
            banHours.setHours(banHours.getHours() + this.hours);
            await this.database.ban.create({PenguinID: banned.ID, ModeratorID: this.user.ID, Reason: 0, Comment: this.reason, Expires: banHours});
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
        this.user = await this.getData();
        let doesItemExist = await this.database.inventory.findOne({where: {ItemID: this.item}});
        if(!doesItemExist){
            await this.database.inventory.create({PenguinID: this.user.ID, ItemID: this.item });
            this.response.redirect('/panel');
        }
        else{
            this.type = 'item_exist';
            this.response.render('update', await this.displaySite());
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

    async checkBanExistance(){
        let user = await this.database.penguin.findOne({where: {Username: this.bannedUsername}});
        if(user){
            return true;
        }
    }

    async getData(){
        if(this.username){
            let user = await this.database.penguin.findOne({where: {Username: this.username}});
            return user;
        }

        else{
            let user = await this.database.penguin.findOne({where: {ID: this.id}});
            return user;
        }
    }
}

module.exports = Panel;