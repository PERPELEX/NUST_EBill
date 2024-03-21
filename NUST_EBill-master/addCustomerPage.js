document.addEventListener('DOMContentLoaded', function () {
  var addCustomerForm = document.getElementById('addCustomer');

  if (addCustomerForm) {
    addCustomerForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const custName = document.getElementById('custName').value;
      const cnic = document.getElementById('cnic').value;
      const password = document.getElementById('password').value;
      const custAddress = document.getElementById('custAddress').value;
      const custCity = document.getElementById('custCity').value;
      const custProvince = document.getElementById('custProvince').value;
      const custZip = document.getElementById('custZip').value;

      console.log('Customer Name:', custName);
      console.log('CNIC:', cnic);
      console.log('Password:', password);
      console.log('Address:', custAddress);
      console.log('City:', custCity);
      console.log('Province:', custProvince);
      console.log('ZIP Code:', custZip);

      const isCustomerAdded = await addCustomer(
        custName,
        cnic,
        password,
        custAddress,
        custCity,
        custProvince,
        custZip
      );

      console.log('Customer Added:', isCustomerAdded);

      if (isCustomerAdded) {
        console.log('Customer Added Successfully');
        alert('Customer Added Successfully!');
        window.location.href = 'addCustomerPage.html'; // Redirect to the same page or another page after successful addition
      } else {
        console.log('Failed to add customer');
        alert('Failed to add customer. Please try again.');
      }
    });
  }
});


async function addCustomer(custName, cnic, password, custAddress, custCity, custProvince, custZip) {
  const url = 'http://localhost:3000/addCustomer';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        custName,
        cnic,
        password,
        custAddress,
        custCity,
        custProvince,
        custZip,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Server Response:', result);

    return result.isCustomerAdded;
  } catch (error) {
    console.error('Error during customer addition:', error);
    return false;
  }

}


// const isAdd = addCustomer('Fazal', '1231231231231', 'fazalpass', 'mcs', 'pindi', 'punjab', '12345');
// if (isAdd) {
//   console.log('Customer Added!');
// } else {
//   console.log('Not added!');
// }