/*
Manage data about one or more documents in the accounts collection
 */

import DS from 'ember-data';
import JamModel from '../mixins/jam-model';

export default DS.Model.extend(JamModel, {
    // TODO: Add validators and length limits to fields for UI layer
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    username: DS.attr('string'),
    phone: DS.attr('phone'),
    profile: DS.attr(), // Should match config.profileSchema layout
    permissions: DS.attr(),

    history: DS.hasMany('history'),
    sessions: DS.hasMany('session')
});
