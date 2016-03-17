import Ember from 'ember';
import * as ace from 'ace/ace';

export default Ember.Component.extend({
    height: '300px',

    value: null,
    editor: null,
    _initValue: null,
    isValidSyntax: true,

    ctx: Ember.computed('isValidSyntax', function () {
        return {
            submit: this.get('actions.onClick').bind(this),
            validSyntax: this.get('isValidSyntax'),
            notValidSyntax: !this.get('isValidSyntax')
        };
    }),

    didInsertElement() {
        this.set('_initValue', this.get('value') || '{}');
        this.set('editor', ace.edit(this.$('#editor')[0]));

        this.editor.setHighlightActiveLine(false);
        this.editor.setShowPrintMargin(false);
        this.editor.getSession().setTabSize(4);
        this.editor.getSession().setMode('ace/mode/json');

        this.get('editor').getSession().setValue(this.get('_initValue'));

        this.get('editor').getSession().on('change', this._onChange.bind(this));
        this.get('editor').getSession().on('changeAnnotation', this._onChangeAnnotation.bind(this));
    },

    _onChange() {
        this.set('value', this.editor.getSession().getValue());
    },

    _onChangeAnnotation(e, session) {
        if (session.getValue().length < 1) {
            this.set('isValidSyntax', false);
        }

        let annotations = session.getAnnotations();

        for (var i = 0; i < annotations.length; i++) {
            if (annotations[i].type === 'error') {
                this.set('isValidSyntax', false);
            }
        }
        this.set('isValidSyntax', true);
    },

    valueChanged: Ember.observer('value', function () {
        if (!this.get('value')) {
            this.editor.getSession().setValue('');
        } else if (this.editor.getSession().getValue() !== this.get('value')) {
            this.editor.getSession().setValue(this.get('value'));
        }
    }),

    actions: {
        onClick() {
            this.sendAction('submit', this.get('editor'));
        }
    }

});
