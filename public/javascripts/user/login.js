const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const outer = document.getElementById("outer");

signUpButton.addEventListener("click", () => {
  outer.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  outer.classList.remove("right-panel-active");
});

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

const matchPassword = () => {
  const massage = document.getElementById("matchPassword");
  const signupBtn = document.getElementById("signupBtn");
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password != confirmPassword) {
    massage.innerHTML = "Password Not Match";
    signupBtn.setAttribute("disabled", "disabled");
  } else {
    massage.innerHTML = "";
    signupBtn.removeAttribute("disabled");
  }
};

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const userData = {
    username: document.getElementById("signupUsername").value,
    email: document.getElementById("signupEmail").value,
    password: document.getElementById("signupPassword").value,
  };

  Swal.fire({
    title: "Confirm Email Address",
    text: `We Send A Confirmation Link To ${userData.email}`,
    icon: "warning",
    showCancelButton: true,
    cancelButtonColor: "#f0ad4e",
    confirmButtonColor: "#5cb85c",
    cancelButtonText: "Change Email Id",
    confirmButtonText: "Yes, Send Mail!",
  }).then((result) => {
    if (result.isConfirmed) {
      axios.post("/signup", userData).then(({ data }) => {
        if (data.status === "Success") {
          Swal.fire(
            "Email Sended!",
            `Verification Email Sended To ${userData.email} "Click The link and Login"`,
            "success"
          );
          outer.classList.remove("right-panel-active");
        } else if (data.status === "Duplicate")
          Swal.fire({
            icon: "error",
            title: "Email already in Exist",
            text: `${userData.email} is already existing`,
          });
        else
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong with Signup Try again later!",
          });
      });
    }
  });
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const loginData = {
    email: document.getElementById("loginEmail").value,
    password: document.getElementById("loginPassword").value,
  };

  axios.post("/login", loginData).then(({ data }) => {
    if (data.status === "Error") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with Login Try again later!",
      });
    } else if (!data.status) {
      document.getElementById("incorrectAlert").innerHTML =
        "Incorrect Email or Password";
    } else if (data.status === "unverified")
      Swal.fire({
        title: "Email Not Verified!",
        text: `Please Verify Your Email ${loginData.email}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Resend Email",
      }).then((result) => {
        if (result.isConfirmed) {
          axios.post("/resendEmail", data);
          Swal.fire(
            "Eamil Sended!",
            `A confirmation link is sended to ${data.email}`,
            "success"
          );
        }
      });
    else if (data.status === "Success") {
      window.location = "/";
    }

    else if(data.status === "blocked") {
      Swal.fire('Multiple Try','Please Try After 24 Hours','error')
    }
  });
});

const clearIncorrectAlert = () => {
  document.getElementById("incorrectAlert").innerHTML = "";
};
