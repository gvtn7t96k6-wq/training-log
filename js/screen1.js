import { supabase } from "./supabase.js";

// =================================

// カレンダーの表示

// =================================

const today = new Date();

// 表示する年月（切り替え可能）

let displayDate = new Date();

const calendarMonth = document.getElementById("calendarMonth");

const calendarDays = document.getElementById("calendarDays");

const prevMonth = document.getElementById("prevMonth");

const nextMonth = document.getElementById("nextMonth");

const monthNames = [

    "January", "February", "March", "April",

    "May", "June", "July", "August",

    "September", "October", "November", "December"

];

// Supabaseから取得した記録日

let recordedDates = [];

// =================================

// Supabaseから記録を取得

// =================================

async function loadCalendar() {

    const { data, error } = await supabase

        .from("training_records")

        .select("workout_date");

    if (error) {

        console.error("トレーニング記録の取得エラー:", error);

        // DBから記録を取得できなくても、日付自体は表示する
        createCalendar();
        return;

    }

    // 記録日を重複なしで取得

    recordedDates = [

        ...new Set(data.map(item => item.workout_date))

    ];

    createCalendar();

}

// =================================

// カレンダーを生成

// =================================

function createCalendar() {

    const year = displayDate.getFullYear();

    const month = displayDate.getMonth();

    // 月のタイトルを更新

    calendarMonth.textContent =

        `${monthNames[month]} ${year}`;

    // 月初の曜日

    const firstDay = new Date(

        year,

        month,

        1

    ).getDay();

    // 月末の日付

    const lastDate = new Date(

        year,

        month + 1,

        0

    ).getDate();

    calendarDays.innerHTML = "";

    // 月初までの空白

    for (let i = 0; i < firstDay; i++) {

        const emptyDay = document.createElement("div");

        emptyDay.classList.add("calendar-day");

        calendarDays.appendChild(emptyDay);

    }

    // 日付を生成

    for (let date = 1; date <= lastDate; date++) {

        const day = document.createElement("div");

        day.classList.add("calendar-day");

        const number = document.createElement("span");

        number.textContent = date;

        const dateKey =

            `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;

        // 今日の日付を強調

        if (

            year === today.getFullYear() &&

            month === today.getMonth() &&

            date === today.getDate()

        ) {

            day.classList.add("today");

        }

        // 記録がある日を強調

        if (recordedDates.includes(dateKey)) {

            day.classList.add("recorded");

        }

        // 日付クリックで記録を表示

        day.addEventListener("click", function() {

            showRecord(dateKey);

        });

        day.appendChild(number);

        calendarDays.appendChild(day);

    }

}

// =================================

// 前月・次月の切り替え

// =================================

prevMonth.addEventListener("click", function() {

    displayDate.setMonth(displayDate.getMonth() - 1);

    createCalendar();

});

nextMonth.addEventListener("click", function() {

    displayDate.setMonth(displayDate.getMonth() + 1);

    createCalendar();

});

// =================================

// 記録内容の表示

// =================================

const recordModal = document.getElementById("recordModal");

const modalDate = document.getElementById("modalDate");

const modalContent = document.getElementById("modalContent");

const closeModal = document.getElementById("closeModal");

async function showRecord(dateKey) {

    const { data, error } = await supabase

        .from("training_records")

        .select("*")

        .eq("workout_date", dateKey);

    if (error) {

        console.error("取得エラー:", error);

        return;

    }

    const [year, month, date] = dateKey.split("-");

    modalDate.textContent =

        `${year}年${Number(month)}月${Number(date)}日の記録`;

    modalContent.innerHTML = "";

    if (data.length === 0) {

        modalContent.textContent =

            "この日のトレーニング記録はありません。";

    } else {

        const strengthTitle = document.createElement("h3");

        strengthTitle.textContent = "Strength Training";

        modalContent.appendChild(strengthTitle);

        // 種目ごとにまとめる

        const exercises = {};

        data.forEach(item => {

            if (item.exercise === "有酸素運動") return;

            if (!exercises[item.exercise]) {

                exercises[item.exercise] = {

                    sets: 0,

                    reps: item.reps

                };

            }

            exercises[item.exercise].sets++;

        });

        if (Object.keys(exercises).length > 0) {

            Object.entries(exercises).forEach(([name, detail]) => {

                const item = document.createElement("div");

                item.classList.add("modal-exercise");

                const nameElement = document.createElement("span");

                nameElement.textContent = name;

                const detailElement = document.createElement("span");

                detailElement.textContent =

                    `${detail.sets}セット × ${detail.reps}回`;

                item.appendChild(nameElement);

                item.appendChild(detailElement);

                modalContent.appendChild(item);

            });

        } else {

            const noStrength = document.createElement("p");

            noStrength.textContent = "筋トレの記録はありません。";

            modalContent.appendChild(noStrength);

        }

        const cardioTitle = document.createElement("h3");

        cardioTitle.textContent = "Cardio Training";

        modalContent.appendChild(cardioTitle);

        const cardioText = document.createElement("p");

        cardioText.classList.add("modal-cardio");

        const cardio = data.find(

            item => item.cardio_memo && item.cardio_memo.trim() !== ""

        );

        cardioText.textContent =

            cardio ? cardio.cardio_memo : "記録はありません。";

        modalContent.appendChild(cardioText);

    }

    recordModal.classList.add("active");

}

// =================================

// ポップアップを閉じる

// =================================

closeModal.addEventListener("click", function() {

    recordModal.classList.remove("active");

});

recordModal.addEventListener("click", function(event) {

    if (event.target === recordModal) {

        recordModal.classList.remove("active");

    }

});

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        recordModal.classList.remove("active");

    }

});

// =================================

// ボタンの画面遷移

// =================================

document.getElementById("recordButton").addEventListener("click", function() {

    window.location.href = "record.html";

});

document.getElementById("resultButton").addEventListener("click", function() {

    window.location.href = "result.html";

});

// =================================

// カレンダー読み込み
// DBの応答を待たずに日付を先に表示する

// =================================

createCalendar();
loadCalendar();