import Ember from 'ember';

export default Ember.Component.extend({
    experiment: null,
    sessions: null,
    editing: false,
    toast: Ember.inject.service(),
    store: Ember.inject.service(),
    namespaceConfig: Ember.inject.service(),
    deleting: false,
    showDeleteWarning: false,
    actions: {
        toggleEditing() {
            this.toggleProperty('editing');
            if (!this.get('editing') && this.get('experiment.hasDirtyAttributes')) {
                this.get('experiment').save().then(() => {
                    this.get('toast.info')('Experiment saved successfully.');
                });
            }
        },
        stop() {
            var exp = this.get('experiment');
            exp.set('state', exp.ARCHIVED);
            exp.save().then(() => this.get('store').findRecord('collection', exp.get('sessionCollectionId'))
                .then((collection) => {
                    collection.set('permissions', {});
                    return collection.save();
                })
                .then(() => this.get('toast.info')('Experiment stopped successfully.'))
            );
        },
        start() {
            var exp = this.get('experiment');
            exp.set('state', exp.ACTIVE);
            exp.save().then(() => this.get('store').findRecord('collection', exp.get('sessionCollectionId'))
                .then((collection) => {
                    collection.set('permissions', {
                        [`jam-${this.get('namespaceConfig').get('namespace')}:accounts-*`]: 'CREATE'
                    });
                    return collection.save();
                })
                .then(() => this.get('toast.info')('Experiment started successfully.'))
            );
        },
        delete() {
            this.toggleProperty('showDeleteWarning');
            this.set('deleting', true);

            var exp = this.get('experiment');
            exp.set('state', exp.DELETED);
            exp.save().then(() => this.get('store').findRecord('collection', exp.get('sessionCollectionId'))
                .then((collection) => {
                    collection.set('permissions', {});
                    return collection.save();
                })
                .then(() => this.sendAction('onDelete', exp))
            );
        },
        clone() {
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
            } else {
                finish();
            }
        },
        onSetImage(thumbnail) {
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
