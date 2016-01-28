import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('exp-frame-example', 'Integration | Component | exp frame example', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{exp-frame-example}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#exp-frame-example}}
      template block text
    {{/exp-frame-example}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
