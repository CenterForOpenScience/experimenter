/*
Manage data about one or more documents in the experiments collection
 */

import DS from 'ember-data';
import JamModel from '../mixins/jam-model';

export default DS.Model.extend(JamModel, {
    title: DS.attr('string'),
    description: DS.attr('string'),
    active: DS.attr('boolean'),
    structure: DS.attr(),
    permissions: DS.attr(),

    administrators: DS.hasMany('admin'),
    history: DS.hasMany('history'),
    sessions: DS.hasMany('session'),
});
