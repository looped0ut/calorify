// ---------- AUTH CHECK ----------
const userId = localStorage.getItem("userId");

if (!userId) {
  alert("Please login first");
  window.location.href = "../index.html";
}

// ---------- FETCH PROFILE FROM DB ----------
fetch(`http://localhost:3000/dashboard/${userId}`)
  .then(res => {
    if (!res.ok) throw new Error("Profile not found");
    return res.json();
  })
  .then(data => {

    /* ---------- BASIC INFO ---------- */
    document.getElementById("welcomeText").innerText =
      `Goal: ${data.dietary_goal} | Activity: ${data.activity_level}`;

    /* ---------- BMI ---------- */
    const h = data.height / 100;
    const w = data.weight;
    const bmi = (w / (h * h)).toFixed(1);
    document.getElementById("bmiValue").innerText = bmi;

    let bmiCat = "", bmiColor = "#2ecc71";
    if (bmi < 18.5) bmiCat = "Underweight";
    else if (bmi < 25) bmiCat = "Normal";
    else if (bmi < 30) { bmiCat = "Overweight"; bmiColor = "#f39c12"; }
    else { bmiCat = "Obese"; bmiColor = "#e74c3c"; }

    document.getElementById("bmiCategory").innerText = bmiCat;

    /* Ring animation */
    const circle = document.querySelector(".progress");
    circle.style.stroke = bmiColor;
    const offset = 408 * (1 - Math.min(bmi / 40, 1));
    setTimeout(() => circle.style.strokeDashoffset = offset, 300);

    /* ---------- BMR ---------- */
    let bmr;
    if (data.gender === "Male")
      bmr = 10 * w + 6.25 * data.height - 5 * data.age + 5;
    else
      bmr = 10 * w + 6.25 * data.height - 5 * data.age - 161;

    /* ---------- TDEE ---------- */
    const activityMap = {
      "Sedentary": 1.2,
      "Moderate": 1.375,
      "Active": 1.55,
      "Very Active": 1.725
    };

    const tdee = Math.round(bmr * activityMap[data.activity_level]);

    document.getElementById("maintain").innerText = tdee;
    document.getElementById("loss").innerText = tdee - 500;
    document.getElementById("gain").innerText = tdee + 400;

    /* ---------- FITNESS SCORE ---------- */
    let score = 50;

    if (bmi >= 18.5 && bmi <= 24.9) score += 20;
    if (data.activity_level === "Active" || data.activity_level === "Very Active") score += 20;
    if (data.lifestyle === "Balanced") score += 10;

    document.getElementById("fitnessScore").innerText = score;
    document.getElementById("fitnessText").innerText =
      score > 80 ? "Excellent fitness level" :
      score > 60 ? "Good, keep improving" :
      "Needs lifestyle improvement";

    /* ---------- ADVICE ENGINE ---------- */
    const advice = [];

    if (data.dietary_goal === "Weight Loss")
      advice.push("Focus on calorie deficit with high-protein foods.");

    if (data.dietary_goal === "Weight Gain")
      advice.push("Increase calorie intake with strength training.");

    if (data.activity_level === "Sedentary")
      advice.push("Try at least 30 minutes of walking daily.");

    if (data.health_background && !data.health_background.includes("None"))
      advice.push("Consult a professional due to health conditions.");

    if (data.diet_preference === "Vegetarian")
      advice.push("Ensure enough protein via legumes and dairy.");

    const list = document.getElementById("adviceList");
    list.innerHTML = "";
    advice.forEach(a => {
      const li = document.createElement("li");
      li.innerText = a;
      list.appendChild(li);
    });

  })
  .catch(err => {
    console.error(err);
    alert("Unable to load dashboard data");
  });

/* ---------- NAVIGATION ---------- */
function goToMeal() {
  window.location.href = "../photo/photo.html";
}
