import DS from 'ember-data';

export default DS.Model.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  username: DS.attr('string'),
  password: DS.attr('string'),
  permissions: DS.attr(),

  configs: DS.belongsTo('config'),
  experiments: DS.hasMany('experiment'),
  history: DS.hasMany('history'),
});
