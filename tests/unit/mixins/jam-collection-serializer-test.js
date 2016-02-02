import Ember from 'ember';
import JamCollectionSerializerMixin from '../../../mixins/jam-collection-serializer';
import { module, test } from 'qunit';

module('Unit | Mixin | jam collection serializer');

// Replace this with your real tests.
test('it works', function(assert) {
  let JamCollectionSerializerObject = Ember.Object.extend(JamCollectionSerializerMixin);
  let subject = JamCollectionSerializerObject.create();
  assert.ok(subject);
});
