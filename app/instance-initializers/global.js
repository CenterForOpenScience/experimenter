export function initialize(appInstance) {
    // Make application instance available globally to allow dynamic registration of new models.
    //  Refs http://emberigniter.com/accessing-global-object-in-ember-cli-app/  ; TODO: Is there a better way?
    window.App = appInstance;
}

export default {
    name: 'global',
    initialize: initialize
};
