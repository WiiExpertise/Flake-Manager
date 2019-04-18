const configuration = {
    mysql: {
        host: 'localhost',
        username: 'root',
        password: '',
        port: 3306,
        database: 'Houdini'
    },
    http: {
        port: 4444, 
        site_key: '',/* Recaptcha keys v3 from google */ 
        secret_key: '', 
        session_secret: '' /* Random secret key (get one from randomkeygen.com) */ 
    },
    panel: {
        add_items: 1, /* Set to 0 if you want to disable this feature */
        verify_users: 1,
    }
};


   
module.exports = configuration;
