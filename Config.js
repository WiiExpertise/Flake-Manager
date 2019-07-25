const configuration = {
    mysql: {
        host: 'localhost',
        username: '',
        password: '',
        port: 3306,
        database: 'Houdini'
    },
    http: {
        port: 3000, 
        site_key: '',/* Recaptcha keys v3 from google */ 
        secret_key: '', 
        session_secret: '' /* Random secret key (get one from randomkeygen.com) */ 
    },
    panel: {
        add_items: 1, /* Set this or the below to 0 if you want to disable a feature */
        verify_users: 1,
        manage_penguins: 1,
        redemption: 1,
    },

    reset_password_mail: {
        reset_password: 0, /* Set this to 1 if you want to use the reset password feature and fill in the below: */
        gmail_user: '', /* Register a new GMAIL account as the email used to send the reset password link, or change the service from GMAIL to your preference.*/
        gmail_pass: '', /* Enter the GMAIL accounts password here*/
        cpps_name: 'Flake', /* The name of your CPPS that will appear in the reset password email */
        sub_domain: 'manager.flake.co' /* The sub-domain that you are using to host the manager, as the link has to be i.e. manager.yourcpps.com/reset_password, if this isn't set properly it'll break the reset password feature. It should load from the same subdomain that /panel or /update is loaded from i.e. manager.cpps.com/panel means the subdomain is manager.cpps.com  */
    }
};


   
module.exports = configuration;
