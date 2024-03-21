
document.addEventListener('DOMContentLoaded', function () {
  var loginForm = document.getElementById('loginForm');

  if (loginForm) {
      loginForm.addEventListener('submit', async function (event) {
          // Prevent the default form submission
          event.preventDefault();

          // Get form data
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;

          console.log('Username:', username);
          console.log('Password:', password);

          // Call the authentication function
          const isAuthenticated = await authenticateUser(username, password);

          console.log('Authentication Result:', isAuthenticated);

          // Handle the authentication result
          if (isAuthenticated) {
              // Redirect to the Admin Menu Page page
              
              window.location.href = 'adminMenuPage.html';
              console.log('Login Successful');
              alert('Login Successful!');
            } else {
                // Display login failed message
                console.log('Login Failed');
                alert('Login Failed!');
          }
      });
  }
});



async function authenticateUser(username, password) {
  const url = 'http://localhost:3000/authenticate';

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              username: username,
              password: password,
          }),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      
      return result.isAuthenticated;
  } catch (error) {
      console.error('Error during authentication:', error);
      return false;
  }
}
