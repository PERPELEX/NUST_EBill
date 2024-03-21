document.addEventListener('DOMContentLoaded', function () {
  var addMeterForm = document.getElementById('addMeter');

  if (addMeterForm) {
      addMeterForm.addEventListener('submit', async function (event) {
          event.preventDefault();

          const custCNIC = document.getElementById('CNIC').value;
          const meterType = document.getElementById('meterType').value;

          console.log('CNIC:', custCNIC);
          console.log('Meter Type:', meterType);

          const isMeterAdded = await addMeter(custCNIC, meterType);

          console.log('Meter Added:', isMeterAdded);

          if (isMeterAdded) {
              console.log('Meter Added Successfully');
              alert('Meter Added Successfully!');
              window.location.href = 'addMeterPage.html'; // Redirect to the same page or another page after successful addition
          } else {
              console.log('Failed to add meter');
              alert('Failed to add meter. Please try again.');
          }
      });
  }
});

async function addMeter(custCNIC, meterType) {
  
  const url = 'http://localhost:3000/addMeter';

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              custCNIC,
              meterType,
          }),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Server Response:', result);

      return result.isInserted;
  } catch (error) {
      console.error('Error during meter addition:', error);
      return false;
  }
}
