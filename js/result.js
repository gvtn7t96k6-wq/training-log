// ===================================
// 1. 保存されている記録を取得
// ===================================

const trainingRecords = JSON.parse(
    localStorage.getItem("trainingRecords") || "[]"
);


// ===================================
// 2. 最高セット数・最高回数を計算
// ===================================

let maxSets = 0;
let maxReps = 0;

trainingRecords.forEach(record => {

    let dailySets = 0;
    let dailyReps = 0;

    record.exercises.forEach(exercise => {

        dailySets += Number(exercise.sets);
        dailyReps += Number(exercise.sets) * Number(exercise.reps);

    });

    maxSets = Math.max(maxSets, dailySets);
    maxReps = Math.max(maxReps, dailyReps);

});


// ===================================
// 3. HTMLに数値を表示
// ===================================

document.getElementById("totalDays").textContent =
    trainingRecords.length;

document.getElementById("maxSets").textContent =
    maxSets;

document.getElementById("maxReps").textContent =
    maxReps;


// ===================================
// 4. 月ごとの記録日数を集計
// ===================================

const monthlyCounts = {};

trainingRecords.forEach(record => {

    const month = record.date.substring(0, 7);

    monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;

});

const monthlyLabels = Object.keys(monthlyCounts).sort();

const monthlyData = monthlyLabels.map(month => {
    return monthlyCounts[month];
});


// ===================================
// 5. 月別棒グラフを表示
// ===================================

const monthlyCanvas = document.getElementById("monthlyChart");

new Chart(monthlyCanvas, {

    type: "bar",

    data: {
        labels: monthlyLabels,

        datasets: [{
            label: "Training Days",
            data: monthlyData,
            backgroundColor: "#36a39c",
            borderRadius: 6
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false
            }
        },

        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    }

});


// ===================================
// 6. Dashboardに戻る
// ===================================

document.getElementById("backButton").addEventListener("click", function() {

    window.location.href = "screen1.html";

});