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

test('CSV for ISP - Full Example', function(assert) {
    this.set('sanitizeProfileId', sanitizeProfileId);
    this.set('data', ispSurvey);
    this.render(hbs`{{export-tool data=data mappingFunction=sanitizeProfileId}}`);
    this.$('.export-tool-select').val('CSV (for ISP)');
    this.$('.export-tool-select').change();

    assert.strictEqual(
        this.$('.export-tool-textarea').val(),
        svJoin([
            'PID,SID,locale,Age,Gender,Ethnicity,Language,SocialStatus,BirthCity,BirthCountry,Residence,Religion1to10,ReligionYesNo,ReligionFollow,EventTime,WhatResponse,WhereResponse,WhoResponse,ThreeCat_rsq1,ThreeCat_rsq2,ThreeCat_rsq3,ThreeCat_rsq4,ThreeCat_rsq5,ThreeCat_rsq6,ThreeCat_rsq7,ThreeCat_rsq8,ThreeCat_rsq9,ThreeCat_rsq10,ThreeCat_rsq11,ThreeCat_rsq12,ThreeCat_rsq13,ThreeCat_rsq14,ThreeCat_rsq15,ThreeCat_rsq16,ThreeCat_rsq17,ThreeCat_rsq18,ThreeCat_rsq19,ThreeCat_rsq20,ThreeCat_rsq21,ThreeCat_rsq22,ThreeCat_rsq23,ThreeCat_rsq24,ThreeCat_rsq25,ThreeCat_rsq26,ThreeCat_rsq27,ThreeCat_rsq28,ThreeCat_rsq29,ThreeCat_rsq30,ThreeCat_rsq31,ThreeCat_rsq32,ThreeCat_rsq33,ThreeCat_rsq34,ThreeCat_rsq35,ThreeCat_rsq36,ThreeCat_rsq37,ThreeCat_rsq38,ThreeCat_rsq39,ThreeCat_rsq40,ThreeCat_rsq41,ThreeCat_rsq42,ThreeCat_rsq43,ThreeCat_rsq44,ThreeCat_rsq45,ThreeCat_rsq46,ThreeCat_rsq47,ThreeCat_rsq48,ThreeCat_rsq49,ThreeCat_rsq50,ThreeCat_rsq51,ThreeCat_rsq52,ThreeCat_rsq53,ThreeCat_rsq54,ThreeCat_rsq55,ThreeCat_rsq56,ThreeCat_rsq57,ThreeCat_rsq58,ThreeCat_rsq59,ThreeCat_rsq60,ThreeCat_rsq61,ThreeCat_rsq62,ThreeCat_rsq63,ThreeCat_rsq64,ThreeCat_rsq65,ThreeCat_rsq66,ThreeCat_rsq67,ThreeCat_rsq68,ThreeCat_rsq69,ThreeCat_rsq70,ThreeCat_rsq71,ThreeCat_rsq72,ThreeCat_rsq73,ThreeCat_rsq74,ThreeCat_rsq75,ThreeCat_rsq76,ThreeCat_rsq77,ThreeCat_rsq78,ThreeCat_rsq79,ThreeCat_rsq80,ThreeCat_rsq81,ThreeCat_rsq82,ThreeCat_rsq83,ThreeCat_rsq84,ThreeCat_rsq85,ThreeCat_rsq86,ThreeCat_rsq87,ThreeCat_rsq88,ThreeCat_rsq89,ThreeCat_rsq90,NineCat_rsq1,NineCat_rsq2,NineCat_rsq3,NineCat_rsq4,NineCat_rsq5,NineCat_rsq6,NineCat_rsq7,NineCat_rsq8,NineCat_rsq9,NineCat_rsq10,NineCat_rsq11,NineCat_rsq12,NineCat_rsq13,NineCat_rsq14,NineCat_rsq15,NineCat_rsq16,NineCat_rsq17,NineCat_rsq18,NineCat_rsq19,NineCat_rsq20,NineCat_rsq21,NineCat_rsq22,NineCat_rsq23,NineCat_rsq24,NineCat_rsq25,NineCat_rsq26,NineCat_rsq27,NineCat_rsq28,NineCat_rsq29,NineCat_rsq30,NineCat_rsq31,NineCat_rsq32,NineCat_rsq33,NineCat_rsq34,NineCat_rsq35,NineCat_rsq36,NineCat_rsq37,NineCat_rsq38,NineCat_rsq39,NineCat_rsq40,NineCat_rsq41,NineCat_rsq42,NineCat_rsq43,NineCat_rsq44,NineCat_rsq45,NineCat_rsq46,NineCat_rsq47,NineCat_rsq48,NineCat_rsq49,NineCat_rsq50,NineCat_rsq51,NineCat_rsq52,NineCat_rsq53,NineCat_rsq54,NineCat_rsq55,NineCat_rsq56,NineCat_rsq57,NineCat_rsq58,NineCat_rsq59,NineCat_rsq60,NineCat_rsq61,NineCat_rsq62,NineCat_rsq63,NineCat_rsq64,NineCat_rsq65,NineCat_rsq66,NineCat_rsq67,NineCat_rsq68,NineCat_rsq69,NineCat_rsq70,NineCat_rsq71,NineCat_rsq72,NineCat_rsq73,NineCat_rsq74,NineCat_rsq75,NineCat_rsq76,NineCat_rsq77,NineCat_rsq78,NineCat_rsq79,NineCat_rsq80,NineCat_rsq81,NineCat_rsq82,NineCat_rsq83,NineCat_rsq84,NineCat_rsq85,NineCat_rsq86,NineCat_rsq87,NineCat_rsq88,NineCat_rsq89,NineCat_rsq90,PosNeg,SitSimilarity,BBI1,BBI2,BBI3,BBI4,BBI5,BBI6,BBI7,BBI8,BBI9,BBI10,BBI11,BBI12,BBI13,BBI14,BBI15,BBI16,Risk,BFI1,BFI2,BFI3,BFI4,BFI5,BFI6,BFI7,BFI8,BFI9,BFI10,BFI11,BFI12,BFI13,BFI14,BFI15,BFI16,BFI17,BFI18,BFI19,BFI20,BFI21,BFI22,BFI23,BFI24,BFI25,BFI26,BFI27,BFI28,BFI29,BFI30,BFI31,BFI32,BFI33,BFI34,BFI35,BFI36,BFI37,BFI38,BFI39,BFI40,BFI41,BFI42,BFI43,BFI44,BFI45,BFI46,BFI47,BFI48,BFI49,BFI50,BFI51,BFI52,BFI53,BFI54,BFI55,BFI56,BFI57,BFI58,BFI59,BFI60,SWB1,SWB2,SWB3,SWB4,IntHapp1,IntHapp2,IntHapp3,IntHapp4,IntHapp5,IntHapp6,IntHapp7,IntHapp8,IntHapp9,Constru1,Constru2,Constru3,Constru4,Constru5,Constru6,Constru7,Constru8,Constru9,Constru10,Constru11,Constru12,Constru13,Tight1,Tight2,Tight3,Tight4,Tight5,Tight6,ChangeYesNo,ChangeDescribe,ChangeSuccess,Trust1,Trust2,Trust3,Trust4,Trust5,LOT1,LOT2,LOT3,LOT4,LOT5,LOT6,Honest1,Honest2,Honest3,Honest4,Honest5,Honest6,Honest7,Honest8,Honest9,Honest10,Micro1,Micro2,Micro3,Micro4,Micro5,Micro6,Narq1,Narq2,Narq3,Narq4,Narq5,Narq6,ReligionScale1,ReligionScale2,ReligionScale3,ReligionScale4,ReligionScale5,ReligionScale6,ReligionScale7,ReligionScale8,ReligionScale9,ReligionScale10,ReligionScale11,ReligionScale12,ReligionScale13,ReligionScale14,ReligionScale15,ReligionScale16,ReligionScale17',
            '"5514232571-something","someString","en-US",32,1,"Special","Tagalog",6,"Big Crater","The Moon",1,1,2,,"15:00","Eating something","Daydreaming","alone",1,2,2,1,2,3,3,1,2,1,2,2,3,2,3,3,2,1,2,3,1,2,1,2,1,2,3,3,2,2,3,2,3,3,2,2,2,2,1,2,1,2,2,1,3,2,2,3,3,2,1,2,1,2,2,2,3,3,2,2,2,1,2,2,3,2,2,1,2,2,3,2,2,2,1,1,2,1,2,3,3,3,1,2,2,2,2,2,1,2,2,6,5,1,4,7,8,6,5,6,6,4,8,3,8,7,4,2,3,7,7,4,4,5,1,6,8,8,4,3,6,6,7,7,3,5,5,5,4,5,6,6,5,2,7,4,4,6,7,5,1,6,2,5,5,4,9,9,4,6,5,3,6,5,7,5,3,2,4,5,8,5,4,5,3,3,4,3,5,9,7,7,3,6,3,4,6,5,2,5,6,4,4,7,7,4,5,3,7,7,3,7,4,4,6,7,4,8,0,2,3,4,2,5,2,5,2,4,1,5,2,4,2,5,1,5,2,4,1,5,1,5,4,3,2,5,5,5,1,4,1,5,1,1,1,2,4,5,1,5,5,1,5,1,5,1,1,5,4,4,2,1,5,1,1,5,5,5,4,7,7,7,6,4,4,1,1,1,1,1,1,1,1,1,2,2,8,2,2,3,2,2,3,2,3,4,3,3,3,2,4,2,,,5,4,3,3,1,3,3,3,4,2,4,1,3,3,2,5,2,4,2,4,1,4,1,3,2,4,,2,4,2,3,3,3,1,2,2,2,2,2,3,4,3,2,4,2,3,3,4,3,3'
        ])
    );
});
