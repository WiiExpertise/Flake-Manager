# Flake - A user panel for Houdini

NOTE: Credit to jackie/@Pyrodash for writing the Avatar API. 

written by ~ ro, feel free to fork or use whatever code/assets you want from this.

preview/screenshots: https://imgur.com/a/7gKPs5U https://imgur.com/a/YpRZUwW https://imgur.com/a/WqdXNv6 https://imgur.com/a/7GbpcLL https://imgur.com/a/0qs21aD https://imgur.com/a/nnABs7s https://imgur.com/a/vmGx7Iw https://imgur.com/a/6wI5xZ7 https://imgur.com/a/3bqaq94 https://imgur.com/a/PL9wLvG


# How to use?


 - install node.js on your VPS or laptop.
 - upload your manager somewhere (apart from the web-server of course!), use `cd` to go to the directory wherever it is placed. 
 - Once you are in the directory, you can run `npm install` and it will download all the dependencies you need for this manager to work. 
 - Now all you have to do is edit Configuration.js.
 - Run the manager from terminal using the command `node Boot`. 
 - Party.

# Requirements

Just execute `npm install` to install the dependencies all at once.
 
   
- The only file you have to edit is Configuration.js, what you need to edit in there is the secret session key, it has to be something random and secure so get a password from the Strong Passwords section of: https://randomkeygen.com/ 

- Edit these if you wish: https://imgur.com/a/J8ZGDx4 to specify if you want it available for everyone or for certain people. Per feature you edit, keep it as 0 if you DONT want the feature to appear at all, OR change it to 1 if you want the feature to appear to normal users (redemption and adding items), or to moderators (managing penguins and verifying usernames) OR set the feature to 2 if you want it to appear for administrators only, if it is set to 2, you must specify who is an administrator by adding their ID to the list here https://imgur.com/a/qfwlZQ0.

- Register your recaptcha keys from google recaptcha (v3). Add your site and secret key here: https://imgur.com/a/JZ54E6V

- When running this panel, you need your sub-domain to be reverse proxying off port 4444 so that you can visit your panel link directly, instead of having :3000 added at the end of it. So edit your nginx configuration, add this line proxy_pass http://localhost:3000/;. Make sure the default placed line try_files $uri $uri/ =404; is removed. You can find a similar alternative for apache too. If you choose to not reverse proxy, you will have to visit the link via subdomain:3000 (adding :3000 on the end of the URL). This is not recommended, although is still possible. Make sure you keep your panel files away from your web-server, which means DON'T put them in /var/www/html or /var/www.

- Using nodemailer and gmails service, you can have an option to reset your password without logging into the panel, for this to work you need a GMAIL account dedicated for the CPPS reset password links, this will be used to email the links, the details of the account will be specified in Configuration.js so that it's usable. Remember this feature is disabled by default so if you want to enable it, you need to set reset_password to 1 in Configuration.js

- The reset password feature uses a table to keep track of reset password links expiry and usability, please insert this new table into your database (assuming you use Houdini) https://pastebin.com/KhdRsDLE. Then setup your GMAIL account, configure the username and password in Configuration.js and make sure you set the sub_domain field to the sub domain you are running the manager off i.e. manager.cpps.com. This is so that it can send the correct reset password link leading to i.e. manager.cpps.com/reset/unique_id. 


Any issues or suggestions, just email me: root@rsakeys.org
