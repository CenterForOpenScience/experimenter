/*
Manage data about one or more documents in the accounts collection
 */

import DS from 'ember-data';
import JamModel from '../mixins/jam-model';

export default DS.Model.extend(JamModel, {
    username: DS.attr('string'),
    password: DS.attr('string'),

    permissions: DS.attr(),

    history: DS.hasMany('history'),
    profile: DS.belongsTo('profile'),
    sessions: DS.hasMany('session')
});
