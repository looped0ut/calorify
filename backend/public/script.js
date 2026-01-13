const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// ---------- SIGNUP ----------
function signup() {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (!name || !email || !password) {
    alert("Fill all fields");
    return;
  }

  fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(data => {
      // store logged-in user id
      localStorage.setItem("userId", data.userId);

      // ✅ NEW USER → QUESTIONNAIRE
      window.location.href = "input/userProfile.html";
    })
    .catch(() => alert("Signup failed / User already exists"));
}

// ---------- SIGNIN ----------
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(data => {
      // store logged-in user id
      localStorage.setItem("userId", data.userId);

      // ✅ EXISTING USER → DASHBOARD
      window.location.href = "dashboard/dashboard.html";
    })
    .catch(() => alert("Invalid email or password"));
}
