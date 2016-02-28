export function initialize(application) {
    application.register('darkroom:main', window.Darkroom, {instantiate: false});
    application.inject('component:img-selector', 'Darkroom', 'darkroom:main');
}

export default {
    name: 'init-darkroom',
    initialize
};
