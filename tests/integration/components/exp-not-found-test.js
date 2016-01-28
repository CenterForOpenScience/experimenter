import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('exp-not-found', 'Integration | Component | exp not found', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{exp-not-found}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#exp-not-found}}
      template block text
    {{/exp-not-found}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
