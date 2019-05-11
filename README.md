# Flake - A user panel written in NodeJS for Houdini 


A fully functional manager system written in nodeJS, sequelize used for database transactions and express.js for collecting http post requests. Has basic checks for whether the session is expired or not, it also does not give any UNAUTHORIZED access to certain parts, e.g. if you are not logged in, you'll be redirected to the login page, if you aren't a moderator and you're trying to access /verify or /unban it will redirect you to the main panel. This was created for Houdini's ban, inventory and penguin table structure for it's features. Different interfaces by rendering the ejs file based on whether you are a moderator or normal user, allows owners (who use this manager) to choose whether a user is allowed to add items or not, allows admins to ban and unban users, allows normal users to change their password, email and verify usernames. The panel has an avatar to display a graphical representation of your penguin, it also displays your username, email, coins and rank. 

NOTE: Credit to jackie/@Pyrodash for the Avatar API code written by him.

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


LATEST UPDATE:

- Updated VIMEO snippet to show the image rendered avatars instead of SWFs.
- Better looking buttons added.
- Site key is now configured in Config.js instead of the index.html file.

