import {
    moduleForComponent, test
}
from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ace-editor', 'Integration | Component | ace editor', {
    integration: true
});

test('it renders', function(assert) {
    var value = JSON.stringify({
        foo: 'bar'
    });
    this.set('value', value);

    this.render(hbs `{{ace-editor value=value}}`);
    assert.equal(
        this.$('#editor').hasClass('ace_editor'),
        true
    );
});
