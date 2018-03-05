const askEnum = {
    /** string, SimpleResonse ou RichResponse */
    ask: 'ask',
    askWithList: 'askWithList',
    askWithCarousel: 'askWithCarousel',
    /** 1 message string optionnel */
    askForConfirmation: 'askForConfirmation',
    /** 3 string optionnelles : un message initial, un message pour le choix du jour, un message pour le choix de l'heure */
    askForDateTime: 'askForDateTime',
    askForDeliveryAddress: 'askForDeliveryAddress',
    askForNewSurface: 'askForNewSurface',
    askForPermission: 'askForPermission',
    askForPermissions: 'askForPermissions',
    askForSignIn: 'askForSignIn',
    askForTransactionDecision: 'askForTransactionDecision',
    askForTransactionRequirements: 'askForTransactionRequirements',
    askForUpdatePermission: 'askForUpdatePermission',
    askToRegisterDailyUpdate: 'askToRegisterDailyUpdate'
};

module.exports = Object.freeze(askEnum);