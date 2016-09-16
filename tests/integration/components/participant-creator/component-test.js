import {
    moduleForComponent,
    test
} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('/participant-creator', 'Integration | Component | participant creator', {
    integration: true
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });"

    this.render(hbs `{{participant-creator}}`);

    assert.ok(this.$().text());

    // Template block usage:"
    this.render(hbs `
    {{#participant-creator}}
      template block text
    {{/participant-creator}}
  `);

    assert.ok(this.$().text());
});
