/*
Manage data about one or more documents in the admin collection
 */

import DS from 'ember-data';
import JamModel from '../mixins/jam-model';

export default DS.Model.extend(JamModel, {
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    username: DS.attr('string'),
    password: DS.attr('string'),

    permissions: DS.attr(),

    configs: DS.belongsTo('config'),
    experiments: DS.hasMany('experiment'),
    history: DS.hasMany('history'),
});
