// =================================
// トレーニング記録機能
// =================================
// Supabaseとの接続テスト
console.log("record.js 読み込み成功");
import { supabase } from "./supabase.js";
async function testConnection() {
    const { data, error } = await supabase
        .from("training_records")
        .select("*");

    if (error) {
        console.error("接続エラー:", error);
        return;
    }

    console.log("DBから取得したデータ:", data);
}

testConnection();
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

form.addEventListener("submit", async function(event) {
event.preventDefault();

if (!validateForm()) {
    return;
}

const trainingData = [];

for (const exercise of exercises) {

    const sets = Number(document.getElementById(
        exercise.id + "Sets"
    ).value);

    const reps = Number(document.getElementById(
        exercise.id + "Reps"
    ).value);
console.log(exercise.name, "入力回数:", reps);
    if (!sets && !reps) {
        continue;
    }

    for (let i = 1; i <= sets; i++) {
        trainingData.push({
            workout_date: dateInput.value,
            exercise: exercise.name,
            set_number: i,
            reps: reps,
            weight: 0,
            cardio_memo: cardioMemo.value.trim()
        });
    }
}

// 有酸素運動だけの日にも対応
if (trainingData.length === 0 && cardioMemo.value.trim() !== "") {
    trainingData.push({
        workout_date: dateInput.value,
        exercise: "有酸素運動",
        set_number: 0,
        reps: 0,
        weight: 0,
        cardio_memo: cardioMemo.value.trim()
    });
}

// Supabaseに保存
const { error } = await supabase
    .from("training_records")
    .insert(trainingData);

if (error) {
    console.error("保存エラー:", error);
    alert("保存に失敗しました。");
    return;
}

alert("トレーニングを記録しました！");

window.location.href = "screen1.html";
});


// 初期状態を確認
validateForm();