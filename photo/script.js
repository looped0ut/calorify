const API_KEY = "C1M+LK7mVQrUDIjqPJ6Z9w==kMsFWmKIrjwhdOKG";

function analyzeImage() {
  const input = document.getElementById("imageInput");
  const file = input.files[0];

  if (!file) {
    alert("Please upload an image");
    return;
  }

  // Show preview
  document.getElementById("preview").innerHTML =
    `<img src="${URL.createObjectURL(file)}">`;

  document.getElementById("result").innerText = "Analyzing image...";

  const formData = new FormData();
  formData.append("image", file);

  fetch("https://api.calorieninjas.com/v1/imagetextnutrition", {
    method: "POST",
    headers: {
      "X-Api-Key": API_KEY
    },
    body: formData
  })
  .then(res => res.json())
  .then(data => displayResult(data))
  .catch(err => {
    console.error(err);
    document.getElementById("result").innerText =
      "Could not analyze image. Try manual input.";
  });
}

function displayResult(data) {
  const resultDiv = document.getElementById("result");

  if (!data.items || data.items.length === 0) {
    resultDiv.innerText = "Auto detection failed.";
    document.getElementById("manualInput").style.display = "block";
    return;
  }

  let totalCalories = 0;
  let output = "Detected Food:\n";

  data.items.forEach(item => {
    totalCalories += item.calories;
    output += `${item.name} - ${item.calories} kcal\n`;
  });

  resultDiv.innerText =
    output + `\nTotal Calories: ${totalCalories.toFixed(2)} kcal`;
}

function getCaloriesByText() {
  const food = document.getElementById("foodName").value;

  if (!food) {
    alert("Please enter food name");
    return;
  }

  fetch(`https://api.calorieninjas.com/v1/nutrition?query=${food}`, {
    headers: {
      "X-Api-Key": API_KEY
    }
  })
  .then(res => res.json())
  .then(data => {
    const resultDiv = document.getElementById("result");

    if (!data.items || data.items.length === 0) {
      resultDiv.innerText = "Food not found.";
      return;
    }

    let totalCalories = 0;
    let output = "Manual Entry Result:\n";

    data.items.forEach(item => {
      totalCalories += item.calories;
      output += `${item.name} - ${item.calories} kcal\n`;
    });

    resultDiv.innerText =
      output + `\nTotal Calories: ${totalCalories.toFixed(2)} kcal`;
  })
  .catch(err => {
    console.error(err);
    alert("Error fetching calorie data");
  });
}

function getCaloriesByText() {
  const food = document.getElementById("foodName").value;

  if (!food) {
    alert("Please enter food name");
    return;
  }

  fetch(`https://api.calorieninjas.com/v1/nutrition?query=${food}`, {
    headers: {
      "X-Api-Key": API_KEY
    }
  })
  .then(res => res.json())
  .then(data => {
    const resultDiv = document.getElementById("result");

    if (!data.items || data.items.length === 0) {
      resultDiv.innerText = "Food not found.";
      return;
    }

    let totalCalories = 0;
    let output = "Manual Entry Result:\n";

    data.items.forEach(item => {
      totalCalories += item.calories;
      output += `${item.name} - ${item.calories} kcal\n`;
    });

    resultDiv.innerText =
      output + `\nTotal Calories: ${totalCalories.toFixed(2)} kcal`;
  })
  .catch(err => {
    console.error(err);
    alert("Error fetching calorie data");
  });
}