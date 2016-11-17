import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('export-tool', 'Integration | Component | export tool', {
    integration: true
});

const DATA = [{
    age: 35,
    profileId: 'test.test'
}];

const sanitizeProfileId = function(session) {
    session.profileId = session.profileId.split('.').slice(-1)[0];
    return session;
};

test('JSON format', function(assert) {
    this.set('sanitizeProfileId', sanitizeProfileId);
    this.set('data', DATA);
    this.render(hbs`{{export-tool data=data mappingFunction=sanitizeProfileId}}`);
    assert.equal(this.$('.export-tool-textarea').val(), JSON.stringify(DATA, null, 4));
});

test('CSV format', function(assert) {
    this.set('sanitizeProfileId', sanitizeProfileId);
    this.set('data', DATA);
    this.render(hbs`{{export-tool data=data mappingFunction=sanitizeProfileId}}`);
    this.$('.export-tool-select').val('CSV');
    this.$('.export-tool-select').change();
    assert.equal(this.$('.export-tool-textarea').val(), 'age,profileId\n35,"test"');
});

test('CSV format handles commas', function(assert) {
    this.set('sanitizeProfileId', sanitizeProfileId);
    const data = [{
        response: 'running, swimming, biking',
        profileId: 'test.test'
    }];
    this.set('data', data);
    this.render(hbs`{{export-tool data=data mappingFunction=sanitizeProfileId}}`);
    this.$('.export-tool-select').val('CSV');
    this.$('.export-tool-select').change();
    const csv = 'response,profileId\n"running, swimming, biking","test"';
    assert.equal(this.$('.export-tool-textarea').val(), csv);
});

test('CSV format handles double quotes', function(assert) {
    this.set('sanitizeProfileId', sanitizeProfileId);
    const data = [{
        response: 'This is a "quote"',
        profileId: 'test.test'
    }];
    this.set('data', data);
    this.render(hbs`{{export-tool data=data mappingFunction=sanitizeProfileId}}`);
    this.$('.export-tool-select').val('CSV');
    this.$('.export-tool-select').change();
    const csv = 'response,profileId\n"This is a ""quote""","test"';
    assert.equal(this.$('.export-tool-textarea').val(), csv);
});

test('CSV format handles new lines', function(assert) {
    this.set('sanitizeProfileId', sanitizeProfileId);
    const data = [{
        response: 'One line\nAnother line',
        profileId: 'test.test'
    }];
    this.set('data', data);
    this.render(hbs`{{export-tool data=data mappingFunction=sanitizeProfileId}}`);
    this.$('.export-tool-select').val('CSV');
    this.$('.export-tool-select').change();
    const csv = 'response,profileId\n"One line\\nAnother line","test"';
    assert.equal(this.$('.export-tool-textarea').val(), csv);
});

test('CSV format handles non-english characters', function(assert) {
    this.set('sanitizeProfileId', sanitizeProfileId);
    const data = [{
        spanish: 'áéíñóúü¿¡',
        french: 'àâæçèëïîôœùûüÿ€',
        russian: 'дфяшйж',
        hindi: 'हिंदी',
        arabic: 'العربية',
        profileId: 'test.test'
    }];
    this.set('data', data);
    this.render(hbs`{{export-tool data=data mappingFunction=sanitizeProfileId}}`);
    this.$('.export-tool-select').val('CSV');
    this.$('.export-tool-select').change();
    const csv = 'spanish,french,russian,hindi,arabic,profileId\n"áéíñóúü¿¡","àâæçèëïîôœùûüÿ€","дфяшйж","हिंदी","العربية","test"';
    assert.equal(this.$('.export-tool-textarea').val(), csv);
});
