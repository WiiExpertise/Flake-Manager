const CONFIG = { 
    HTTP: { 
      ACCOUNT: 4444, // change port if you're reverse proxying off another port.
      SESSION_SECRET: '' // get a random string/key from https://randomkeygen.com/, don't share this w anyone!
    },
    MYSQL: {
        HOST: 'localhost',
        USER: 'root',
        PASS: '',
        PORT: 3306,
        DATABASE: 'Houdini'
    },
    ERROR_MSGS: {
        USERNAME_NOT_EXIST: 'The username you entered does not exist.',
        INCORRECT_PASSWORD: 'The password you entered is not correct.',
        CAPTCHA: 'The captcha detects that you may be a bot!',
        ERROR: 'Something went wrong during this registration!'  // change these custom messages if you wish :~)
    },
    UPDATE_MSG: {
        EMAIL: 'Enter the new email address you want your penguin to have.',
        PASSWORD: 'Enter the new password you want your penguin to have.',
        ITEM: 'Enter the Item ID you want to add to your inventory in-game',
        ITEM_EXISTS: 'The Item ID you entered is already in your inventory!',
        VERIFY_USERS: 'Verify these penguins usernames!',
        BAN: 'Enter the username, hours and reason for a penguins ban!',
        UNBAN: 'Choose who you want to unban.' // change these custom messages if you wish :~)
    },
    OPTIONS: {
        ADD_ITEMS: 1, // Set this option to 1, if you want NORMAL users to add any item they want to their penguin.
        VERIFY_USERS: 1 // Set this option to 1, if you want MODERATORS to be able to verify a user.
    },
    CAPTCHA: {
        SECRET_KEY: '' // Get your OWN secret key from the google recaptcha v3 website
    }
};


   
module.exports = CONFIG;
