import Ember from 'ember';

import {permissionCreateForAccounts} from 'exp-models/utils/constants';


export default Ember.Component.extend({
    experiment: null,
    sessions: null,
    editing: false,
    toast: Ember.inject.service(),
    store: Ember.inject.service(),
    deleting: false,
    showDeleteWarning: false,
    actions: {
        toggleEditing: function() {
            this.toggleProperty('editing');
            if (!this.get('editing') && this.get('experiment.hasDirtyAttributes')) {
                this.get('experiment').save().then(() => {
                    this.get('toast.info')('Experiment saved successfully.');
                });
            }
        },
        stop: function() {
            var exp = this.get('experiment');
            exp.set('state', exp.ARCHIVED);
            exp.save().then(() => {
                return this.get('store').findRecord('collection', exp.get('sessionCollectionId')).then((collection) => {
                    collection.set('permissions', {});
                    return collection.save();
                }).then(() => this.get('toast.info')('Experiment stopped successfully.'));
            });
        },
        start: function() {
            var exp = this.get('experiment');
            exp.set('state', exp.ACTIVE);
            exp.save().then(() => {
                return this.get('store').findRecord('collection', exp.get('sessionCollectionId')).then((collection) => {
                    collection.set('permissions', permissionCreateForAccounts);
                    return collection.save();
                }).then(() => this.get('toast.info')('Experiment started successfully.'));
            });
        },
        delete: function() {
            this.toggleProperty('showDeleteWarning');
            this.set('deleting', true);

            var exp = this.get('experiment');
            exp.set('state', exp.DELETED);
            exp.save().then(() => {
                return this.get('store').findRecord('collection', exp.get('sessionCollectionId')).then((collection) => {
                    collection.set('permissions', {});
                    return collection.save();
                }).then(() => this.sendAction('onDelete', exp));
            });
        },
        clone: function() {
            var exp = this.get('experiment');
            var expData = exp.toJSON();
            expData.title = `Copy of ${expData.title}`;
            expData.state = exp.DRAFT;
            var thumbnailId = expData.thumbnailId;
            delete expData.thumbnailId;
            delete expData.beginDate;
            delete expData.endDate;

            var finish = () => {
                var clone = this.get('store').createRecord('experiment', expData);
                clone.save().then(() => {
                    this.sendAction('onClone', clone);
                });
            };

            if (thumbnailId) {
                var thumbnailData = exp.get('thumbnail').toJSON();
                this.get('store').createRecord('thumbnail', thumbnailData).save().then((thumbnail) => {
                    expData.thumbnailId = thumbnail.get('id');
                    finish();
                });
            }
            else {
                finish();
            }
        },
        onSetImage: function(thumbnail) {
            var exp = this.get('experiment');
            exp.set('thumbnail', thumbnail);
            exp.save().then(() => {
                this.toast.info('Thumbnail updated successfully.');
            });
        },
        toggleDeleteWarning() {
            this.toggleProperty('showDeleteWarning');
        }
    }
});
