# Flake-Manager


A fully functional manager system written in nodeJS, sequelize used for database transactions and express.js for collecting http post requests. Has basic checks for whether the session is expired or not, it also does not give any UNAUTHORIZED access to certain parts, e.g. if you are not logged in, you'll be redirected to the login page, if you aren't a moderator and you're trying to access /verify or /unban it will redirect you to the main panel. 

This was created for Houdini's ban, inventory and penguin table structure for it's features. Different interfaces by rendering the ejs file based on whether you are a moderator or normal user, allows owners (who use this manager) to choose whether a user is allowed to add items or not, allows admins to ban and unban users, allows normal users to change their password, email and verify usernames. The panel has an avatar to display a graphical representation of your penguin, it also displays your username, email, coins and rank. 

All code (apart from the avatar API) written by ro and free for anyone to fork.


Credit to jackie/@Pyrodash for the Avatar API code all written by him. Much appreciated <3 



PREVIEW/SNIPPET: https://vimeo.com/321111919

# Requirements

Just execute `npm install` to install ALL dependencies at once, or if you want to do this one by one or for your own node app then do `npm install --save modulename` obviously replacing `modulename` with whatever dependency it is like bcrypt or connect-flash.

    "bcrypt": "^3.0.4",
    "connect-flash": "^0.1.1",
    "ejs": "^2.6.1",
    "express": "^4.16.4",
    "express-session": "^1.15.6",
    "md5": "^2.2.1",
    "mysql2": "^1.6.5",
    "request": "^2.88.0",
    "sequelize": "^4.43.0"

After, you need to register google recaptcha keys from google specifically v3. Edit Config.js and add the secret key there, the site key goes in index.html like shown here: https://i.imgur.com/8seD36D.png in two places.

Edit Config.js and add your MySQL details, add a secret session key here: https://gyazo.com/c906aec8c10962293f71b95f0481f789

Get one from https://randomkeygen.com/ 

Also, edit this: https://gyazo.com/be0f42f821140809928bc09c2d992de1

If you want normal users to have access to adding ANY item, set `ADD_ITEMS` to 1.

If you want moderators to have access to verifying users, set `VERIFY_USERS` to 1. 

It's up to you I suppose, you can also edit each custom message the panel gives for any error or success. 

Reverse proxy is the best way to have this manager running in production, make sure you change the HTTP port (it's 4444 by default), or you can run it off a sub-domain but you will have to access it via sub.domain:4444

Reverse proxying removes the extra 4444 bit, https://www.linode.com/docs/web-servers/nginx/use-nginx-reverse-proxy/

For the avatar to work, edit panel.html and change the two links saying `http://media.localhost/play/v2/client/avatar.swf` to whatever domain yours is, upload avatar.swf (in views) to your client folder because the SWF goes back to the content folder to find the paper, icons and sprites for giving clothing to the avatar. If you don't do this correctly, the avatar won't work :~( 


This will remain an open source manager for anyone to use/steal parts of this for their own manager? I don't mind

Enjoy it, if you need assistance with setting this up join https://solero.me/ discord and ping me, my tag is ro#0008


~ ro
