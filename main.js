import { eras } from './eras.js'; // 元号データをインポート
import { yakuList, hosiList, kuseiList } from './disasters.js';

const yaku = new Map(yakuList);

// 元号と年から西暦を計算する関数
function convertToSeireki(eraCode, eraYear) {
    const era = eras.find(e => e.code === eraCode);
    const result = era.start + eraYear - 1;
    if (!era || !era.start || era.end < result || eraYear < 0) return null;
    return result;
}

// 誕生年(西暦)から現在の数え年を計算する関数
function convertToKazoedosi(seireki, thisYear =  new Date().getFullYear()) {
    return thisYear - seireki + 1;
}

// 誕生年(西暦)から、干支を計算する関数
function convertToEto(seireki) {
    const etos = ["申","酉","戌","亥","子","丑","寅","卯","辰","巳","午","未"]
    return etos[seireki % 12];
}

// 誕生年と数え年から星回りを計算する関数
function convertToHosi(seireki, kazoedoshi) {
    const index = (seireki + kazoedoshi) % hosiList.length;
    return hosiList[index];
}

// 結果を表示するためのdiv要素を作成
const createResult = ( seireki, kazoedoshi, eto ) => {
    const div = document.createElement('div');
    const h1 = document.createElement('h1');
    // h1.textContent = `${kazoedoshi}歳 ${eto}年 ${kuseiList[seireki % 9]}`;
    h1.textContent = `${kazoedoshi}歳 ${eto}年`;
    div.appendChild(h1);
    const table = document.createElement('table');
    for (let i = 0; i <= 6; i++) {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        td1.textContent = i === 0 ? '今年' :
                          i === 1 ? '来年' :
                          `${i}年後`;
        const td2 = document.createElement('td');
        td2.textContent = `${kazoedoshi + i}歳`;
        const td3 = document.createElement('td');
        td3.textContent = `${hosiList[(kazoedoshi + i) % 9]}`;
        const td4 = document.createElement('td');
        td4.textContent = yaku.get(kazoedoshi + i) || '';
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        table.appendChild(tr);
    }
    div.appendChild(table);
    return div;
};

// イベント処理
window.onload = function() {
    const eraSelect = document.createElement('select');
    eraSelect.id = 'era';
    eras.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e.code;
            opt.textContent = e.name;
            eraSelect.appendChild(opt);
    });
    const yearInput = document.createElement('input');
    yearInput.type = 'number';
    yearInput.id = 'year';
    yearInput.placeholder = '年を入力';
    yearInput.min = 1;
    const resultDiv = document.createElement('div');

    // 計算&表示処理の関数
    function showResult() {
        const code = eraSelect.value;
        const year = parseInt(yearInput.value,10);
        const seireki = convertToSeireki(code, year);
        const kazoedoshi = convertToKazoedosi(seireki);
        const eto = convertToEto(seireki);
        if (seireki) {
           while (resultDiv.firstChild) {
            resultDiv.removeChild(resultDiv.firstChild);
           }
            resultDiv.appendChild(createResult(seireki,kazoedoshi, eto));
        } else {
            resultDiv.textContent = '正しい元号と年を入力してください。';
        }
    }


    // 入力や元号選択時に自動で計算
    yearInput.addEventListener('input', showResult);
    eraSelect.addEventListener('change', showResult);


    // 入力後しばらく何も入力がなければ全選択
    let selectTimer = null;
    yearInput.addEventListener('input', () => {
        // yearが4桁なら「西暦」を選択
        if(yearInput.value.length === 4 && /^[0-9]+$/.test(yearInput.value)) {
                eraSelect.selectedIndex = "-";
                yearInput.select();
        }
        showResult();

        if (selectTimer) clearTimeout(selectTimer);
        selectTimer = setTimeout(() => {
            yearInput.select();
        }, 1500); // 1.5秒後に全選択
        })


// キー入力で元号を選択する
document.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    if (/^[0-9]$/.test(key)) {
        if (document.activeElement !== yearInput) {
            yearInput.focus();
            if(yearInput.selectionStart === 0 && yearInput.selectionEnd === yearInput.value.length) {
                yearInput.value = key;
            } else {
                yearInput.value += key;
            }
            yearInput.dispatchEvent(new Event('input'));
            e.preventDefault();
        }
        return;
    }
    const idx = Array.from(eraSelect.options).findIndex(opt => opt.value === key);
    if (idx !== -1) {
        eraSelect.selectedIndex = idx;
        showResult();
    }
});


    document.body.appendChild(eraSelect);
    document.body.appendChild(yearInput);
    document.body.appendChild(resultDiv);
};
