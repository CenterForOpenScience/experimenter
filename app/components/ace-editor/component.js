import Ember from 'ember';

export default Ember.Component.extend({
    mode: 'json',
    height: '300px',

    value: null,
    editor: null,
    _initValue: null,
    isValidSyntax: true,

    ctx: function() {
        return {
            submit: this.get('actions.onClick').bind(this),
            validSyntax: this.get('isValidSyntax'),
            notValidSyntax: !this.get('isValidSyntax'),
        };
    }.property('isValidSyntax'),

    didInsertElement() {
        this.set('_initValue', this.get('value') || '');
        this.set('editor', ace.edit(this.$('#editor')[0]));

        this.get('editor').getSession().setValue(this.get('_initValue'));
        this.get('editor').getSession().setMode(`ace/mode/${this.get('mode')}`);

        this.get('editor').getSession().on('change', this._onChange.bind(this));
        this.get('editor').getSession().on('changeAnnotation', this._onChangeAnnotation.bind(this));
    },

    _onChange(e, session) {
        // console.log(arguments);
    },

    _onChangeAnnotation(e, session) {
        if (session.getValue().length < 1)
            return this.set('isValidSyntax', false);

        let annotations = session.getAnnotations();

        for(var i = 0; i < annotations.length; i++)
            if (annotations[i].type === 'error')
                return this.set('isValidSyntax', false);

        this.set('isValidSyntax', true)
    },

    actions: {
        onClick() {
            this.sendAction('submit', this.get('editor'));
        }
    }

});
