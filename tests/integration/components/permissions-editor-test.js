import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('permissions-editor', 'Integration | Component | permissions editor', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{permissions-editor}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#permissions-editor}}
      template block text
    {{/permissions-editor}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
