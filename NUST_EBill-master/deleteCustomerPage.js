document.addEventListener('DOMContentLoaded', function () {
  var deleteCustomerForm = document.getElementById('deleteCustomer');

  if (deleteCustomerForm) {
      deleteCustomerForm.addEventListener('submit', async function (event) {
          event.preventDefault();

          const userID = document.getElementById('userID').value;

          console.log('User ID:', userID);

          const isCustomerDeleted = await deleteCustomer(userID);

          console.log('Customer Deleted:', isCustomerDeleted);

          if (isCustomerDeleted) {
              console.log('Customer Deleted Successfully');
              alert('Customer Deleted Successfully!');
              window.location.href = 'deleteCustomerPage.html'; // Redirect to the same page or another page after successful deletion
          } else {
              console.log('Failed to delete customer');
              alert('Failed to delete customer. Please try again.');
          }
      });
  }
});

async function deleteCustomer(cnic) {
  const url = 'http://localhost:3000/deleteCustomer';

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              cnic,
          }),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Server Response:', result);

      return result.deleteStatus;
  } catch (error) {
      console.error('Error during customer deletion:', error);
      return false;
  }
}
