// =================================
// カレンダーの表示
// =================================

const today = new Date();

const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
const currentDate = today.getDate();

const calendarMonth = document.getElementById("calendarMonth");
const calendarDays = document.getElementById("calendarDays");

const monthNames = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

// 月の表示
calendarMonth.textContent =
    `${monthNames[currentMonth]} ${currentYear}`;

// 月の最初の曜日
const firstDay = new Date(
    currentYear,
    currentMonth,
    1
).getDay();

// 月の日数
const lastDate = new Date(
    currentYear,
    currentMonth + 1,
    0
).getDate();

// 記録した日付を取得
const recordedDates =
    JSON.parse(localStorage.getItem("trainingDates")) || [];

// カレンダーを生成
calendarDays.innerHTML = "";

// 月初の空白
for (let i = 0; i < firstDay; i++) {

    const emptyDay = document.createElement("div");
    emptyDay.classList.add("calendar-day");

    calendarDays.appendChild(emptyDay);
}

// 日付を表示
for (let date = 1; date <= lastDate; date++) {

    const day = document.createElement("div");
    day.classList.add("calendar-day");

    const number = document.createElement("span");
    number.textContent = date;

    // 日付データ
    const dateKey =
        `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;

    // 今日の日付
    if (date === currentDate) {
        day.classList.add("today");
    }

    // 記録済みの日付
    if (recordedDates.includes(dateKey)) {
        day.classList.add("recorded");
    }

    // 日付をクリックしたとき
    day.addEventListener("click", function() {
        showRecord(dateKey);
    });

    day.appendChild(number);
    calendarDays.appendChild(day);
}


// =================================
// 記録内容の表示
// =================================

const recordModal = document.getElementById("recordModal");
const modalDate = document.getElementById("modalDate");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

function showRecord(dateKey) {

    // 保存された記録を取得
    const records =
        JSON.parse(localStorage.getItem("trainingRecords")) || [];

    // クリックした日付の記録を探す
    const record = records.find(item => item.date === dateKey);

    // 日付を表示
    const [year, month, date] = dateKey.split("-");

    modalDate.textContent =
        `${year}年${Number(month)}月${Number(date)}日の記録`;

    // 表示内容を初期化
    modalContent.innerHTML = "";

    // 記録がない場合
    if (!record) {

        modalContent.textContent =
            "この日のトレーニング記録はありません。";

    } else {

        // 筋トレ記録
        const strengthTitle = document.createElement("h3");
        strengthTitle.textContent = "Strength Training";

        modalContent.appendChild(strengthTitle);

        if (record.exercises && record.exercises.length > 0) {

            record.exercises.forEach(exercise => {

                const item = document.createElement("div");
                item.classList.add("modal-exercise");

                const name = document.createElement("span");
                name.textContent = exercise.name;

                const detail = document.createElement("span");
                detail.textContent =
                    `${exercise.sets}セット × ${exercise.reps}回`;

                item.appendChild(name);
                item.appendChild(detail);

                modalContent.appendChild(item);

            });

        } else {

            const noStrength = document.createElement("p");
            noStrength.textContent = "筋トレの記録はありません。";

            modalContent.appendChild(noStrength);
        }

        // 有酸素運動
        const cardioTitle = document.createElement("h3");
        cardioTitle.textContent = "Cardio Training";

        modalContent.appendChild(cardioTitle);

        const cardioText = document.createElement("p");
        cardioText.classList.add("modal-cardio");
        cardioText.textContent =
            record.cardio || "記録はありません。";

        modalContent.appendChild(cardioText);
    }

    // ポップアップを表示
    recordModal.classList.add("active");
}


// =================================
// ポップアップを閉じる
// =================================

closeModal.addEventListener("click", function() {
    recordModal.classList.remove("active");
});

// 背景をクリックして閉じる
recordModal.addEventListener("click", function(event) {

    if (event.target === recordModal) {
        recordModal.classList.remove("active");
    }

});

// Escapeキーで閉じる
document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        recordModal.classList.remove("active");
    }

});


// =================================
// ボタンの画面遷移
// =================================

const recordButton = document.getElementById("recordButton");

recordButton.addEventListener("click", function() {
    window.location.href = "record.html";
});

const resultButton = document.getElementById("resultButton");

resultButton.addEventListener("click", function() {
    window.location.href = "result.html";
});