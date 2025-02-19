/*
 * 將要隨機派發的網址放入下方（不需排序）
 *
 * 並請注意：
 * 1. 網址請用引號（或稱「撇號」，單引號或雙引號皆可）包起來
 * 2. 包起來的網址之間用逗號分隔
 */


// 最新的問卷網址列表
const urls = [
    'https://www.surveycake.com/s/46rkB',
    'https://www.surveycake.com/s/3l0qN',
    'https://www.surveycake.com/s/rea98',
    'https://www.surveycake.com/s/yWbQD'
];

// 檢查問卷是否可用
async function checkSurvey(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.log(`❌ ${url} 不可用 (HTTP ${response.status})`);
            return false;
        }

        const text = await response.text();

        // 使用更精確的檢查方式來判斷是否額滿
        if (text.includes("本問卷已額滿") || text.includes("問卷已截止") || text.includes("This survey is closed")) {
            console.log(`❌ ${url} 已額滿`);
            return false;
        }

        console.log(`✅ ${url} 可用`);
        return true;
    } catch (error) {
        console.log(`⚠️ 無法存取 ${url}，錯誤: ${error}`);
        return false;
    }
}

// **等待所有問卷檢查完成後，再隨機選擇**
async function findAvailableSurveys() {
    // 使用 Promise.all 讓所有檢查同時執行，並過濾出可用問卷
    const availableSurveys = (await Promise.all(
        urls.map(async (url) => (await checkSurvey(url)) ? url : null)
    )).filter(Boolean); // 過濾掉 null

    if (availableSurveys.length > 0) {
        // 隨機選擇一個可用問卷
        const randomUrl = availableSurveys[Math.floor(Math.random() * availableSurveys.length)];
        console.log(`🔀 隨機選擇: ${randomUrl}`);
        window.location.href = randomUrl; // 跳轉到問卷
    } else {
        alert("❌ 所有問卷都已額滿，請稍後再試！");
    }
}

// **執行問卷檢查**
findAvailableSurveys();
