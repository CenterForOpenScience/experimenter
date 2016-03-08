import Ember from 'ember';
import RegisterAceEditorInitializer from 'experimenter/initializers/register-ace-editor';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | register ace editor', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  RegisterAceEditorInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
