import Ember from 'ember';
import JamCollectionAdapterMixin from '../../../mixins/jam-collection-adapter';
import { module, test } from 'qunit';

module('Unit | Mixin | jam collection adapter');

// Replace this with your real tests.
test('it works', function(assert) {
  let JamCollectionAdapterObject = Ember.Object.extend(JamCollectionAdapterMixin);
  let subject = JamCollectionAdapterObject.create();
  assert.ok(subject);
});
