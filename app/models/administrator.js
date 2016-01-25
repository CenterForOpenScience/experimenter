import DS from 'ember-data';

export default DS.Model.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  email: DS.attr('string'),

  experiments: DS.hasMany('experiment'),
  configs: DS.hasMany('config'), // TODO: One config (if admins are designated per experiment), or many (if admins are designated per namespace)?
});
