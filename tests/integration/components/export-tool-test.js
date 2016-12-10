import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import ispSurvey from '../../fixtures/isp-survey';

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

test('CSV for ISP - Partial', function(assert) {
    this.set('sanitizeProfileId', sanitizeProfileId);
    this.set('data', [{
        profileId: 'test-profile',
        studyID: 'ABC',
        locale: 'ab-CD',
        expData: {
            '0-0-overview': {
                responses: {
                    Age: 32,
                    Ethnicity: 'Special',
                    SocialStatus: 6,
                    Religion1to10: 1,
                    Gender: 1,
                    BirthCountry: 'The Moon',
                    ReligionFollow: null,
                    BirthCity: 'Big Crater',
                    Residence: 1,
                    Language: 'Tagalog',
                    ReligionYesNo: 2
                }
            }
        }
    }]);
    this.render(hbs`{{export-tool data=data mappingFunction=sanitizeProfileId}}`);
    this.$('.export-tool-select').val('CSV (for ISP)');
    this.$('.export-tool-select').change();

    assert.strictEqual(
        this.$('.export-tool-textarea').val(),
        svJoin([
            'PID,SID,locale,Age,Ethnicity,SocialStatus,Religion1to10,Gender,BirthCountry,ReligionFollow,BirthCity,Residence,Language,ReligionYesNo',
            '"test-profile","ABC","ab-CD",32,"Special",6,1,1,"The Moon",null,"Big Crater",1,"Tagalog",2'
        ])
    );
});

test('CSV for ISP - Partial, Special case 3-3-response form', function(assert) {
    this.set('sanitizeProfileId', sanitizeProfileId);
    this.set('data', [{
        profileId: 'test-profile',
        studyID: 'ABC',
        locale: 'ab-CD',
        expData: {
            '3-3-rating-form': {
                responses: {
                    0: {
                        PosNeg: 6
                    },
                    1: {
                        SitSimilarity: 4
                    },
                    2: {
                        BBI16: 8,
                        BBI6: 3,
                        BBI3: 7,
                        BBI1: 4,
                        BBI10: 7,
                        BBI2: 7,
                        BBI8: 7,
                        BBI9: 3,
                        BBI4: 4,
                        BBI5: 5,
                        BBI15: 4,
                        BBI7: 7,
                        BBI13: 6,
                        BBI11: 4,
                        BBI14: 7,
                        BBI12: 4
                    },
                    3: {
                        Risk: 0
                    }
                }
            }
        }
    }]);
    this.render(hbs`{{export-tool data=data mappingFunction=sanitizeProfileId}}`);
    this.$('.export-tool-select').val('CSV (for ISP)');
    this.$('.export-tool-select').change();

    assert.strictEqual(
        this.$('.export-tool-textarea').val(),
        svJoin([
            'PID,SID,locale,PosNeg,SitSimilarity,BBI16,BBI6,BBI3,BBI1,BBI10,BBI2,BBI8,BBI9,BBI4,BBI5,BBI15,BBI7,BBI13,BBI11,BBI14,BBI12,Risk',
            '"test-profile","ABC","ab-CD",6,4,8,3,7,4,7,7,7,3,4,5,4,7,6,4,7,4,0'
        ])
    );
});

test('CSV for ISP - Full Example', function(assert) {
    this.set('sanitizeProfileId', sanitizeProfileId);
    this.set('data', ispSurvey);
    this.render(hbs`{{export-tool data=data mappingFunction=sanitizeProfileId}}`);
    this.$('.export-tool-select').val('CSV (for ISP)');
    this.$('.export-tool-select').change();

    assert.strictEqual(
        this.$('.export-tool-textarea').val(),
        svJoin([
            'PID,SID,locale,Age,Ethnicity,SocialStatus,Religion1to10,Gender,BirthCountry,ReligionFollow,BirthCity,Residence,Language,ReligionYesNo,WhereResponse,WhatResponse,WhoResponse,EventTime,PosNeg,SitSimilarity,BBI16,BBI6,BBI3,BBI1,BBI10,BBI2,BBI8,BBI9,BBI4,BBI5,BBI15,BBI7,BBI13,BBI11,BBI14,BBI12,Risk,BFI56,BFI17,BFI35,BFI60,BFI40,BFI10,BFI22,BFI20,BFI25,BFI50,BFI37,BFI39,BFI13,BFI34,BFI51,BFI38,BFI41,BFI11,BFI4,BFI21,BFI27,BFI6,BFI8,BFI43,BFI58,BFI42,BFI57,BFI53,BFI47,BFI52,BFI15,BFI12,BFI30,BFI32,BFI26,BFI54,BFI14,BFI45,BFI9,BFI5,BFI24,BFI16,BFI28,BFI49,BFI46,BFI31,BFI1,BFI44,BFI48,BFI18,BFI23,BFI3,BFI7,BFI59,BFI33,BFI19,BFI2,BFI55,BFI36,BFI29,SWB4,SWB3,SWB1,SWB2,IntHapp3,IntHapp8,IntHapp6,IntHapp2,IntHapp1,IntHapp4,IntHapp7,IntHapp9,IntHapp5,Constru4,Constru7,Constru6,Constru2,Constru13,Constru12,Constru10,Constru11,Constru5,Constru1,Constru3,Constru8,Constru9,Tight4,Tight5,Tight1,Tight3,Tight2,Tight6,ChangeYesNo,ChangeDescribe,ChangeSuccess,Trust1,Trust4,Trust2,Trust3,LOT5,LOT4,LOT2,LOT1,LOT3,LOT6,Honest5,Honest1,Honest8,Honest3,Honest7,Honest10,Honest9,Honest4,Honest2,Honest6,Micro3,Micro5,Micro4,Micro1,Micro2,Narq1,Narq5,Narq3,Narq2,Narq4,Narq6,ReligionScale9,ReligionScale12,ReligionScale4,ReligionScale16,ReligionScale3,ReligionScale8,ReligionScale2,ReligionScale10,ReligionScale15,ReligionScale13,ReligionScale6,ReligionScale5,ReligionScale14,ReligionScale11,ReligionScale17,ReligionScale1,ReligionScale7,NineCat.rsq31,NineCat.rsq23,NineCat.rsq50,NineCat.rsq4,NineCat.rsq63,NineCat.rsq11,NineCat.rsq30,NineCat.rsq33,NineCat.rsq9,NineCat.rsq67,NineCat.rsq82,NineCat.rsq60,NineCat.rsq22,NineCat.rsq86,NineCat.rsq88,NineCat.rsq85,NineCat.rsq54,NineCat.rsq77,NineCat.rsq35,NineCat.rsq55,NineCat.rsq3,NineCat.rsq59,NineCat.rsq17,NineCat.rsq14,NineCat.rsq64,NineCat.rsq83,NineCat.rsq70,NineCat.rsq73,NineCat.rsq36,NineCat.rsq21,NineCat.rsq52,NineCat.rsq18,NineCat.rsq43,NineCat.rsq37,NineCat.rsq49,NineCat.rsq62,NineCat.rsq84,NineCat.rsq58,NineCat.rsq16,NineCat.rsq45,NineCat.rsq42,NineCat.rsq72,NineCat.rsq41,NineCat.rsq61,NineCat.rsq15,NineCat.rsq71,NineCat.rsq51,NineCat.rsq46,NineCat.rsq48,NineCat.rsq75,NineCat.rsq28,NineCat.rsq65,NineCat.rsq38,NineCat.rsq10,NineCat.rsq13,NineCat.rsq47,NineCat.rsq6,NineCat.rsq90,NineCat.rsq89,NineCat.rsq74,NineCat.rsq24,NineCat.rsq57,NineCat.rsq25,NineCat.rsq79,NineCat.rsq1,NineCat.rsq68,NineCat.rsq40,NineCat.rsq27,NineCat.rsq44,NineCat.rsq56,NineCat.rsq39,NineCat.rsq34,NineCat.rsq87,NineCat.rsq32,NineCat.rsq53,NineCat.rsq81,NineCat.rsq78,NineCat.rsq8,NineCat.rsq29,NineCat.rsq66,NineCat.rsq2,NineCat.rsq19,NineCat.rsq80,NineCat.rsq69,NineCat.rsq76,NineCat.rsq20,NineCat.rsq12,NineCat.rsq26,NineCat.rsq7,NineCat.rsq5,ThreeCat.rsq31,ThreeCat.rsq23,ThreeCat.rsq50,ThreeCat.rsq4,ThreeCat.rsq63,ThreeCat.rsq11,ThreeCat.rsq37,ThreeCat.rsq33,ThreeCat.rsq9,ThreeCat.rsq21,ThreeCat.rsq67,ThreeCat.rsq82,ThreeCat.rsq60,ThreeCat.rsq29,ThreeCat.rsq86,ThreeCat.rsq88,ThreeCat.rsq85,ThreeCat.rsq54,ThreeCat.rsq77,ThreeCat.rsq35,ThreeCat.rsq55,ThreeCat.rsq3,ThreeCat.rsq59,ThreeCat.rsq17,ThreeCat.rsq14,ThreeCat.rsq64,ThreeCat.rsq83,ThreeCat.rsq70,ThreeCat.rsq73,ThreeCat.rsq36,ThreeCat.rsq22,ThreeCat.rsq52,ThreeCat.rsq18,ThreeCat.rsq43,ThreeCat.rsq30,ThreeCat.rsq58,ThreeCat.rsq62,ThreeCat.rsq84,ThreeCat.rsq74,ThreeCat.rsq16,ThreeCat.rsq45,ThreeCat.rsq42,ThreeCat.rsq72,ThreeCat.rsq49,ThreeCat.rsq41,ThreeCat.rsq61,ThreeCat.rsq15,ThreeCat.rsq19,ThreeCat.rsq51,ThreeCat.rsq46,ThreeCat.rsq48,ThreeCat.rsq75,ThreeCat.rsq28,ThreeCat.rsq65,ThreeCat.rsq38,ThreeCat.rsq10,ThreeCat.rsq13,ThreeCat.rsq56,ThreeCat.rsq6,ThreeCat.rsq90,ThreeCat.rsq89,ThreeCat.rsq24,ThreeCat.rsq57,ThreeCat.rsq25,ThreeCat.rsq79,ThreeCat.rsq1,ThreeCat.rsq68,ThreeCat.rsq40,ThreeCat.rsq27,ThreeCat.rsq44,ThreeCat.rsq47,ThreeCat.rsq39,ThreeCat.rsq34,ThreeCat.rsq87,ThreeCat.rsq32,ThreeCat.rsq53,ThreeCat.rsq81,ThreeCat.rsq78,ThreeCat.rsq8,ThreeCat.rsq66,ThreeCat.rsq2,ThreeCat.rsq71,ThreeCat.rsq80,ThreeCat.rsq69,ThreeCat.rsq76,ThreeCat.rsq20,ThreeCat.rsq12,ThreeCat.rsq26,ThreeCat.rsq7,ThreeCat.rsq5',
            '"5514232571-something","someString","en-US",32,"Special",6,1,1,"The Moon",null,"Big Crater",1,"Tagalog",2,"Daydreaming","Eating something","alone","15:00",6,4,8,3,7,4,7,7,7,3,4,5,4,7,6,4,7,4,0,1,5,1,4,1,1,1,1,3,4,2,5,4,1,4,4,5,5,2,5,5,2,2,1,5,5,5,1,1,2,5,2,1,1,2,5,2,1,4,5,4,1,5,5,5,4,2,5,1,2,5,4,5,5,5,4,3,1,1,5,6,7,7,7,1,1,1,4,4,1,1,1,1,2,2,2,1,3,2,2,3,8,1,2,3,2,3,2,4,3,3,4,2,null,null,5,3,4,3,2,4,3,3,3,4,5,1,2,3,4,1,4,2,3,2,3,4,2,4,1,2,3,2,4,3,3,3,2,2,3,2,4,2,2,4,3,2,2,3,4,3,1,3,6,4,5,1,6,6,3,7,5,3,7,6,4,4,5,3,5,4,3,5,5,4,4,3,5,3,5,4,5,7,6,2,5,5,7,3,6,9,7,7,6,5,6,5,8,8,1,4,6,3,8,7,5,6,8,4,7,5,2,5,5,9,1,5,2,2,5,8,2,4,4,7,6,6,2,7,3,6,4,5,6,3,9,4,3,7,4,6,8,4,3,1,2,1,2,2,2,3,2,1,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,1,2,2,3,1,2,2,3,3,2,2,3,1,2,3,2,1,2,3,1,3,3,2,1,3,2,3,2,1,2,3,1,2,1,1,2,3,1,2,1,3,2,2,1,3,1,1,2,2,3,3,2,1,3,2,2,3,2'
        ])
    );
});
