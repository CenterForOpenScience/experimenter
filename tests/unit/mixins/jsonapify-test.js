import Ember from 'ember';
import JSONApifyMixin from '../../../mixins/jsonapify';
import { module, test } from 'qunit';

module('Unit | Mixin | jsonapify');

// Replace this with your real tests.
test('it works', function(assert) {
  let JSONApifyObject = Ember.Object.extend(JSONApifyMixin);
  let subject = JSONApifyObject.create();
  assert.ok(subject);
});
