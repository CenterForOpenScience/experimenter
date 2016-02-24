import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'a',
  classNames: ['list-group-item'],
  classNameBindings: ['active'],

  icon: null,
  index: null,
  title: null,
  description: null
});
