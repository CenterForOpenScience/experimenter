function generateNumericFields(prefix, total) {
    const arr = [];

    for (let i = 1; i <= total; i++) {
        arr.push(`${prefix}${i}`);
    }

    return arr;
}

// The order from the ISP Codebook
export default [
    'PID',
    'SID',
    'locale',
    'Age',
    'Gender',
    'Ethnicity',
    'Language',
    'SocialStatus',
    'BirthCity',
    'BirthCountry',
    'Residence',
    'Religion1to10',
    'ReligionYesNo',
    'ReligionFollow',
    'EventTime',
    'WhatResponse',
    'WhereResponse',
    'WhoResponse',
    ...generateNumericFields('ThreeCat_rsq', 90),
    ...generateNumericFields('NineCat_rsq', 90),
    'PosNeg',
    'SitSimilarity',
    ...generateNumericFields('BBI', 16),
    'Risk',
    ...generateNumericFields('BFI', 60),
    ...generateNumericFields('SWB', 4),
    ...generateNumericFields('IntHapp', 9),
    ...generateNumericFields('Constru', 13),
    ...generateNumericFields('Tight', 6),
    'ChangeYesNo',
    'ChangeDescribe',
    'ChangeSuccess',
    ...generateNumericFields('Trust', 5),
    ...generateNumericFields('LOT', 6),
    ...generateNumericFields('Honest', 10),
    ...generateNumericFields('Micro', 6),
    ...generateNumericFields('Narq', 6),
    ...generateNumericFields('ReligionScale', 17),
    'completed'
];
