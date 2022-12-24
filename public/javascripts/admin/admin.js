function viewUser(email, username, status) {
    document.getElementById('username').value = username;
    document.getElementById('email').value = email;
    document.getElementById('status').value = status;
  }

  function showEditUserModal(email, username) {
    document.getElementById('editUsername').value = username;
    document.getElementById('editEmail').value = email;
  }

  function showPassword() {
    const value = document.getElementById('show-password').checked
    const password = document.getElementById('password-container')
    const confirmPassword = document.getElementById('confirm-password-container')

    if (value) {
      password.removeAttribute('hidden')
      confirmPassword.removeAttribute('hidden')
    }

    else {
      password.setAttribute('hidden', 'hidden')
      confirmPassword.setAttribute('hidden', 'hidden')
    }

  }

  function editUser() {
    const checked = document.getElementById('show-password').checked
    const username = document.getElementById('editUsername').value
    const email = document.getElementById('editEmail').value

    if (checked) {
      const password = document.getElementById('password').value
      const confirmPassword = document.getElementById('confirm-password').value

      if (password != confirmPassword) document.getElementById('notMatch').removeAttribute('hidden')
      else {

        if (password.length < 6) {
          Swal.fire('Password Is at least 6 characters')
        }
        else doEdit(password)

      }
    }

    else doEdit()
    function doEdit(password) {
      let editData = {}

      if (username.length < 2) {
        Swal.fire('Username is Required')
      }

      else {
        if (password) {

          editData = {
            email: email,
            username: username,
            password: password
          }
        }
        else {
          editData = {
            email: email,
            username: username
          }
        }

        axios.post('/admin/editUser', editData)


        window.location = '/admin'

      }
    }


  }


  function deleteUser(email) {


    Swal.fire({
      title: "Are You Sure?",
      text: `You Want to Delete user  ${email}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post('/admin/deleteUser', { email: email })

        window.location = '/admin'

      }
    });




  }


  document.getElementById('addForm').addEventListener('submit',(e)=>{
       
    e.preventDefault()

    const userData = {
        email : document.getElementById('addEmail').value,
        username : document.getElementById('addUsername').value,
        password : document.getElementById('addPassword').value,
    }
    
    const confirmPassword = document.getElementById('addConfirmPassword').value
    

    if(userData.password !== confirmPassword) {
        Swal.fire('Password And Confirm Password Not Same')
    }
    else {
        axios.post('/admin/addUser',userData).then(({data})=>{

            if(data.status === 'Duplicate') {
                Swal.fire('Email Is Already Exists')
            }
            else window.location = '/admin'

        })
    }

  })
