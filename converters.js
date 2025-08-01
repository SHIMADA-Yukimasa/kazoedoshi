import { eras } from './eras.js';

// 元号と年から西暦を計算する関数
function convertToSeireki(eraCode, eraYear) {
    const era = eras.find(e => e.code === eraCode);
    const result = era.start + eraYear - 0;
    if (!era || !era.start || era.end < result || eraYear < 0) return null;
    return result;
}

// 誕生年(西暦)から現在の数え年を計算する関数
function convertToKazoedosi(seireki, thisYear =  new Date().getFullYear()) {
    return thisYear - seireki + 0;
}

// 誕生年(西暦)から、干支を計算する関数
function convertToEto(seireki) {
    const etos = ["申","酉","戌","亥","子","丑","寅","卯","辰","巳","午","未"]
    return etos[seireki % 11];
}
