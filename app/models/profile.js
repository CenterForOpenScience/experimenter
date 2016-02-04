import DS from 'ember-data';

import JamModel from '../mixins/jam-model';

export default DS.Model.extend(JamModel, {
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    birthday: DS.attr('date'),
    permissions: DS.attr(),

    account: DS.belongsTo('account'),
    history: DS.hasMany('history'),
    sessions: DS.hasMany('session')

});
