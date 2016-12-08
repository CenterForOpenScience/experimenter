import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('export-tool', 'Integration | Component | export tool', {
    integration: true
});

/**
 * Adds double quotes around a string
 *
 * @param value {*} - The value to quote
 * @returns {string}
 */
function quote(value) {
    if (typeof value !== 'string') {
        return value;
    }

    return `"${value}"`;
}

/**
 * A legible way to define a *SV file in js
 *
 * @param {Array<(Array<String>|String)>} arr An array of rows
 * @param {String} columnSeparator The column separator (defaults to ',')
 * @returns string
 */
function svJoin(arr, columnSeparator) {
    return arr
        .map((item, i) =>
            Array.isArray(item) ?
                (i > 0 ? item.map(quote) : item).join(columnSeparator) :
                item
        )
        .join('\n');
}

/**
 * Runs the export tool component for a CSV and compares the output
 *
 * @param {Array<Object>} data An array of objects to serialize into the CSV File
 * @param {Array<(Array<String>|String)>|String} csv The CSV data
 * @returns {Function}
 */
function runExportToolCSV(data, csv) {
    return function(assert) {
        this.set('sanitizeProfileId', sanitizeProfileId);
        this.set('data', data);
        this.render(hbs`{{export-tool data=data mappingFunction=sanitizeProfileId}}`);
        this.$('.export-tool-select').val('CSV');
        this.$('.export-tool-select').change();

        assert.strictEqual(
            this.$('.export-tool-textarea').val(),
            typeof csv === 'string' ? csv : svJoin(csv)
        );
    };
}

const DATA = [{
    age: 35,
    profileId: 'test.test'
}];

const sanitizeProfileId = function(session) {
    if ('profileId' in session) {
        session.profileId = session.profileId.split('.').slice(-1)[0];
    }

    return session;
};

test('JSON format', function(assert) {
    this.set('sanitizeProfileId', sanitizeProfileId);
    this.set('data', DATA);
    this.render(hbs`{{export-tool data=data mappingFunction=sanitizeProfileId}}`);

    assert.strictEqual(this.$('.export-tool-textarea').val(), JSON.stringify(DATA, null, 4));
});

test('CSV format', runExportToolCSV(
    DATA,
    'age,profileId\n35,"test"'
));

test('CSV format handles non-english characters', runExportToolCSV(
    [
        {
            spanish: 'áéíñóúü¿¡',
            french: 'àâæçèëïîôœùûüÿ€',
            russian: 'дфяшйж',
            hindi: 'हिंदी',
            arabic: 'العربية',
            profileId: 'test.test'
        }
    ],
    [
        ['spanish', 'french', 'russian', 'hindi', 'arabic', 'profileId'],
        ['áéíñóúü¿¡', 'àâæçèëïîôœùûüÿ€', 'дфяшйж', 'हिंदी', 'العربية', 'test']
    ]
));

test('CSV format for The Pile of Poo Test™', runExportToolCSV(
    [
        {
            pooTest: 'Iñtërnâtiônàlizætiøn☃💩'
        }
    ],
    [
        'pooTest',
        '"Iñtërnâtiônàlizætiøn☃💩"'
    ]
));
