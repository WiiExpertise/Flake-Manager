# Flake - A user panel written in NodeJS for Houdini 

NOTE: Credit to jackie/@Pyrodash for writing the Avatar API. 

written by ~ ro, feel free to fork or use whatever code/assets you want from this.

preview: https://vimeo.com/331130734

# How to use?


 - install node.js on your VPS or laptop.
 - upload your manager somewhere (apart from the web-server of course!), use `cd` to go to the directory wherever it is placed. 
 - Once you are in the directory, you can run `npm install` and it will download all the dependencies you need for this manager to work. 
 - Now all you have to do is edit Config.js.
 - Run the manager from terminal using the command `node Boot`. 
 - Party.

# Requirements

Just execute `npm install` to install the dependencies all at once.
    
    
    "bcrypt": "^3.0.4",
    "canvas": "^2.3.1",
    "colors": "^1.3.3",
    "connect-flash": "^0.1.1",
    "download": "^7.1.0",
    "ejs": "^2.6.1",
    "express": "^4.16.4",
    "express-session": "^1.15.6",
    "md5": "^2.2.1",
    "mysql2": "^1.6.5",
    "request": "^2.88.0",
    "sequelize": "^4.43.0",
    "url-exists": "^1.0.3"


- The only file you have to edit is Config.js, what you need to edit in there is the secret session key in there, it has to be something random and secure so get any type of password/key from https://randomkeygen.com/ 

- Edit these options: https://gyazo.com/be0f42f821140809928bc09c2d992de1 to allow normal users to add any item in-game or to allow moderators to verify usernames/approval. Just set the options to 1 if you wish.


- Register your recaptcha keys from google recaptcha (v3). Add your site and secret key here: https://i.imgur.com/MBq4Oxm.png

- When running this on your site, you need your sub-domain to be proxying off port 4444 (or whatever port you set in Config.js). So edit your nginx or apache configuration, add this line `proxy_pass http://localhost:3000/;`.


# Fixed Bugs: 

 - Add item feature originally clashed with other peoples items, meaning you couldn't add a certain item if another person already had it, this has been fixed completely so it checks if you have the item through the item ID itself but also filtering through your penguin ID.

- Incorrect ban times has been fixed, it now gives the correct time for how long the ban should last, based on hours given. Originally it used to calculate a very inaccurate timestamp for the expiry date, now it's accurate and adds on the correct amount of hours.

# NEW FEATURES: 

 - You can now (as a moderator) edit any normal user, moderators CANNOT edit each other. You can edit up to their username, password, email, coins, rank, if they are a moderator, if they have an approved username, if they have an activated account. Screenshots are here: https://imgur.com/a/8ap1RYY, https://imgur.com/a/ezJTQkV

- You can now redeem a code through Flake's redemption system, that has checks for if the code exists, if it's been redeemed already or if it's expired. More to come, please lmk any suggestions.

