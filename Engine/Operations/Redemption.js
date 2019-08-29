const Base = require('../../Configuration');
const Displays = require('../Displays');

class Redemption extends Base{
    constructor(request, response, database){
        super();
        this.request = request;
        this.response = response;
        this.database = database;
        this.displays = new Displays(request, response, database);
        this.username = this.request.session.username;
        this.item_list = [];
    }

    async execute(){
        this.collect_body_data();
        this.user = await this.database.execute('penguin', `findOne`, {where: {Username: `${this.username}`}});
        let code = await this.database.execute('redemption_code', `findOne`, {where: {Code: `${this.code}`}});
        let redeemed = await this.database.execute('penguin_redemption', `findAll`, {where: {PenguinID: `${this.user.ID}`}});
        if(this.exists(code)){
            let items = await this.database.execute('redemption_award', `findAll`, {where: {CodeID: `${code.ID}`}});
            for(let item in items)
                this.item_list.push(items[item].Award);
            if(this.redeemed(redeemed, code))
                if(this.expiry(code)){
                    let success = this.displays.find('/redeemed');
                    this.user.Coins += code.Coins
                    let query = JSON.parse(`{"Coins":"${this.user.Coins}", "ID":"${this.user.ID}"}`);
                    await this.database.execute(`penguin_redemption`, `create`, {PenguinID: this.user.ID, CodeID: code.ID});
                    await this.database.update('penguin', query);
                    for (let item in this.item_list)
                        await this.database.execute(`inventory`, `create`, {PenguinID: this.user.ID, ItemID: this.item_list[item]}); /* NOTE: You may see a caught error in terminal if the item you get in redemption is already in your inventory, luckily since all database transactions are under try{} and catch{} blocks, they won't crash the system but will throw an error. */
                    this.response.render(success.page, success.ejs)
                }
        }
    }

    exists(code){
        let error = this.displays.find('/code_not_exist');
        if(code)
            return true;
        this.response.render(error.page, error.ejs);
        return false;
    }

    expiry(code){
        let error = this.displays.find('/outdated_code');
        if(code.Expires > new Date().getTime())
            return true;
        
        this.response.render(error.page, error.ejs);
        return false;
    }

    redeemed(redeemed, code){
        let error = this.displays.find('/already_redeemed');
        let codes = [];
        for(let ID in redeemed)
            codes.push(redeemed[ID].CodeID)

        if(codes.indexOf(Number(code.ID)) == -1)
            return true;

        this.response.render(error.page, error.ejs);
        return false;
    }

    
    collect_body_data(){
        for (let body in this.request.body)
            this[body] = this.request.body[body];
    }


}

module.exports = Redemption;