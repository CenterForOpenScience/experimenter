export function initialize(app) {
    app.register('ace:main', window.ace, {instantiate: false});
    app.inject('component:ace-editor', 'ace', 'ace:main');
}

export default {
  name: 'register-ace-editor',
  initialize
};
