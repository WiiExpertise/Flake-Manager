# Flake - A user panel for Houdini

NOTE: Credit to jackie/@Pyrodash for writing the Avatar API. 

written by ~ ro, feel free to fork or use whatever code/assets you want from this.

preview: https://vimeo.com/331130734

# How to use?


 - install node.js on your VPS or laptop.
 - upload your manager somewhere (apart from the web-server of course!), use `cd` to go to the directory wherever it is placed. 
 - Once you are in the directory, you can run `npm install` and it will download all the dependencies you need for this manager to work. 
 - Now all you have to do is edit Configuration.js.
 - Run the manager from terminal using the command `node Boot`. 
 - Party.

# Requirements

Just execute `npm install` to install the dependencies all at once.
 
   
- The only file you have to edit is Configuration.js, what you need to edit in there is the secret session key in there, it has to be something random and secure so get any type of password/key from https://randomkeygen.com/ 

- Edit these options: https://imgur.com/a/TyE49wE to allow normal users to add any item in-game or to allow moderators to verify usernames/approval. Just set the options to 1 if you wish.


- Register your recaptcha keys from google recaptcha (v3). Add your site and secret key here: https://imgur.com/a/JZ54E6V

- When running this on your site, you need your sub-domain to be proxying off port 3000 (or whatever port you set in Configuration.js). So edit your nginx or apache configuration, add this line `proxy_pass http://localhost:3000/;`.

- Using nodemailer and gmails service, you can have an option to reset your password without logging into the panel, for this to work you need a GMAIL account dedicated for the CPPS reset password links, this will be used to email the links, the details of the account will be specified in Configuration.js so that it's usable. Remember this feature is disabled by default so if you want to enable it, you need to set reset_password to 1 in Configuration.js

# HOW TO SETUP?

- The reset password feature uses a table to keep track of reset password links expiry and usability, please insert this new table into your database (assuming you use Houdini) https://pastebin.com/KhdRsDLE. Then setup your GMAIL account, configure the username and password in Configuration.js and make sure you set the sub_domain field to the sub domain you are running the manager off i.e. manager.cpps.com. This is so that it can send the correct reset password link leading to i.e. manager.cpps.com/reset/unique_id. 

preview: https://imgur.com/a/7gKPs5U https://imgur.com/a/YpRZUwW https://imgur.com/a/WqdXNv6 https://imgur.com/a/7GbpcLL https://imgur.com/a/0qs21aD https://imgur.com/a/nnABs7s https://imgur.com/a/vmGx7Iw https://imgur.com/a/6wI5xZ7 https://imgur.com/a/3bqaq94 https://imgur.com/a/PL9wLvG

Any issues or suggestions, just email me: root@rsakeys.org
