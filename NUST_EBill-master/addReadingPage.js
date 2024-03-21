document.addEventListener('DOMContentLoaded', function () {
  var addReadingForm = document.getElementById('addReading');

  if (addReadingForm) {
      addReadingForm.addEventListener('submit', async function (event) {
          event.preventDefault();

          const connNo = document.getElementById('connNo').value;
          const reading = document.getElementById('reading').value;

          console.log('Meter Number:', connNo);
          console.log('Reading:', reading);

          const isReadingInserted = await addReading(connNo, reading);

          console.log('Reading Inserted:', isReadingInserted);

          if (isReadingInserted) {
              console.log('Reading Inserted Successfully');
              alert('Reading Inserted Successfully!');
              window.location.href = 'addReadingPage.html'; // Redirect to the same page or another page after successful insertion
          } else {
              console.log('Failed to insert reading');
              alert('Failed to insert reading. Please try again.');
          }
      });
  }
});

async function addReading(meterNo, readingValue) {
  const url = 'http://localhost:3000/insertReading';

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              meterNo,
              readingValue,
          }),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Server Response:', result);

      return result.isInserted;
  } catch (error) {
      console.error('Error during reading insertion:', error);
      return false;
  }
}
