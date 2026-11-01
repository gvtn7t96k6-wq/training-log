// =================================
// トレーニング記録機能
// =================================

const form = document.getElementById("trainingForm");

const dateInput = document.getElementById("trainingDate");
const cardioMemo = document.getElementById("cardioMemo");

const completeButton = document.getElementById("completeButton");
const errorMessage = document.getElementById("errorMessage");


// 今日の日付を設定
const today = new Date();

const todayString =
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

dateInput.value = todayString;


// 種目一覧
const exercises = [
    { name: "チェストプレス", id: "chestPress" },
    { name: "ベンチプレス", id: "benchPress" },
    { name: "チンニング", id: "chinUp" },
    { name: "ショルダープレス", id: "shoulderPress" },
    { name: "スクワット", id: "squat" },
    { name: "上体起こし", id: "sitUp" }
];


// 入力内容の確認
function validateForm() {

    let hasTraining = false;
    let hasError = false;

    for (const exercise of exercises) {

        const sets = document.getElementById(
            exercise.id + "Sets"
        ).value;

        const reps = document.getElementById(
            exercise.id + "Reps"
        ).value;

        // 両方空欄なら、その種目は未実施
        if (sets === "" && reps === "") {
            continue;
        }

        hasTraining = true;

        // 片方だけ入力されている場合
        if (sets === "" || reps === "") {
            hasError = true;
            break;
        }

        // 1以上の整数か確認
        if (
            !Number.isInteger(Number(sets)) ||
            !Number.isInteger(Number(reps)) ||
            Number(sets) < 1 ||
            Number(reps) < 1
        ) {
            hasError = true;
            break;
        }
    }

    // 有酸素運動の入力を確認
    const cardio = cardioMemo.value.trim();

    if (cardio !== "") {
        hasTraining = true;
    }

    // 入力内容の判定
    if (dateInput.value === "") {
        errorMessage.textContent = "日付を入力してください。";
        completeButton.disabled = true;
        return false;
    }

    if (hasError) {
        errorMessage.textContent =
            "セット数と回数を正しく入力してください。";
        completeButton.disabled = true;
        return false;
    }

    if (!hasTraining) {
        errorMessage.textContent =
            "トレーニング内容を1つ以上入力してください。";
        completeButton.disabled = true;
        return false;
    }

    errorMessage.textContent = "";
    completeButton.disabled = false;

    return true;
}


// 入力するたびに確認
form.addEventListener("input", validateForm);


// =================================
// 記録完了
// =================================

form.addEventListener("submit", function(event) {

    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    // 筋トレ記録を取得
    const trainingData = [];

    for (const exercise of exercises) {

        const sets = document.getElementById(
            exercise.id + "Sets"
        ).value;

        const reps = document.getElementById(
            exercise.id + "Reps"
        ).value;

        if (sets === "" && reps === "") {
            continue;
        }

        trainingData.push({
            name: exercise.name,
            sets: Number(sets),
            reps: Number(reps)
        });
    }

    // 1日分の記録データ
    const record = {
        date: dateInput.value,
        exercises: trainingData,
        cardio: cardioMemo.value.trim()
    };


    // 保存済みデータを取得
    const records =
        JSON.parse(localStorage.getItem("trainingRecords")) || [];

    // 同じ日付の記録があれば上書き
    const existingIndex = records.findIndex(
        item => item.date === record.date
    );

    if (existingIndex >= 0) {
        records[existingIndex] = record;
    } else {
        records.push(record);
    }

    // 記録データを保存
    localStorage.setItem(
        "trainingRecords",
        JSON.stringify(records)
    );


    // カレンダー用の日付一覧を更新
    const recordedDates =
        JSON.parse(localStorage.getItem("trainingDates")) || [];

    if (!recordedDates.includes(record.date)) {
        recordedDates.push(record.date);
    }

    localStorage.setItem(
        "trainingDates",
        JSON.stringify(recordedDates)
    );


    alert("トレーニングを記録しました！");

    // カレンダーに戻る
    window.location.href = "screen1.html";

});


// 初期状態を確認
validateForm();