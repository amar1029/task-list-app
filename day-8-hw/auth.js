//track auth status of user
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // User is signed in.
        var uid = user.uid;
        new Task(uid.userId)
        console.log(new Task(uid.userId))
        // ...
      } else {
        // User is signed out.
        // ...
      }
    });



//create new account
const newUserForm = document.getElementById('newUserForm')
newUserForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newEmail = document.getElementById('newEmail').value;
    const newPassword = document.getElementById('newPassword').value;
    
    firebase.auth().createUserWithEmailAndPassword(newEmail, newPassword)
    .then(() => {
    document.getElementById('logInPage').style.display = 'none'
    document.getElementById('loggedIn').style.display = "block"
    newUserForm.reset();
    }).catch((error) => {
        // Handle Errors here.
        var error =  errorNewUser;
        error.style.display = "block"
        // ...
      });
})

//login
const existingUserForm = document.getElementById('existingUserForm')
existingUserForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const existingEmail = document.getElementById('existingEmail').value;
    const existingPassword = document.getElementById('existingPassword').value;

    firebase.auth().signInWithEmailAndPassword(existingEmail, existingPassword)
    .then(() => {
    document.getElementById('logInPage').style.display = 'none'
    document.getElementById('loggedIn').style.display = "block"
    existingUserForm.reset();
    }) .catch((error) => {
        // Handle Errors here.
        var error = errorExistingUser;
        error.style.display = "block"
        // ...
      });

})

//log out
const logout = document.getElementById('logoutBtn')
logout.addEventListener('click', (e) => {
    e.preventDefault();
    firebase.auth().signOut()
    document.getElementById('logInPage').style.display = 'block'
    document.getElementById('loggedIn').style.display = "none"
    newUserForm.reset();
    existingUserForm.reset();
    errorNewUser.style.display = 'none';
    errorExistingUser.style.display = 'none'

})



