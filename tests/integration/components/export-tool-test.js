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
 * @param arr {!Array<(Array<String>|String)>} - An array of rows
 * @param columnSeparator - The column separator (defaults to ',')
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
 * Runs the export tool component and compares the output
 *
 * @param data {Array<Object>} - An array of objects to serialize into the CSV File
 * @param csv {Array<(Array<String>|String)>|String} - The CSV data
 * @returns {Function}
 */
function runExportTool(data, csv) {
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

test('CSV format', runExportTool(
    DATA,
    'age,profileId\n35,"test"'
));

test('CSV format handles commas', runExportTool(
    [{
        response: 'running, swimming, biking',
        profileId: 'test.test'
    }],
    'response,profileId\n"running, swimming, biking","test"'
));

test('CSV format handles double quotes', runExportTool(
    [{
        response: 'This is a "quote"',
        profileId: 'test.test'
    }],
    [
        ['response', 'profileId'],
        ['This is a ""quote""', 'test']
    ]
));

test('CSV format handles new lines', runExportTool(
    [{
        response: 'One line\nAnother line',
        profileId: 'test.test'
    }],
    'response,profileId\n"One line\\nAnother line","test"'
));

test('CSV format handles non-english characters', runExportTool(
    [{
        spanish: 'áéíñóúü¿¡',
        french: 'àâæçèëïîôœùûüÿ€',
        russian: 'дфяшйж',
        hindi: 'हिंदी',
        arabic: 'العربية',
        profileId: 'test.test'
    }],
    [
        ['spanish', 'french', 'russian', 'hindi', 'arabic', 'profileId'],
        ['áéíñóúü¿¡', 'àâæçèëïîôœùûüÿ€', 'дфяшйж', 'हिंदी', 'العربية', 'test']
    ]
));

test('CSV format handles deeply nested object with dot notation', runExportTool(
    [{
        alpha: 'one',
        bravo: 'two',
        charlie: {
            delta: 'three'
        },
        echo: {
            foxtrot: {
                golf: 'four'
            }
        },
        hotel: {
            india: 'five',
            juliet: {
                kilo: 'six'
            }
        },
        lima: {
            mike: {
                november: {
                    oscar: {
                        papa: {
                            quebec: 'seven'
                        }
                    }
                }
            }
        }
    }],
    [
        [
            'alpha',
            'bravo',
            'charlie.delta',
            'echo.foxtrot.golf',
            'hotel.india',
            'hotel.juliet.kilo',
            'lima.mike.november.oscar.papa.quebec'
        ],
        [
            'one',
            'two',
            'three',
            'four',
            'five',
            'six',
            'seven'
        ]
    ]
));
