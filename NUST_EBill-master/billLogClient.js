document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.loginForm form');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const meterNum = document.getElementById('meterNum').value;

        try {
            
            const response = await fetch('http://localhost:3000/fetchData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ meterNum }),
            });

            const data = await response.json();

            if (data.error) {
                alert(data.error);
            } else {
                // Display the fetched data (customize this part based on your needs)
                alert('Data Found:\n' + JSON.stringify(data, null, 2));
                console.log('Data Found:\n' + JSON.stringify(data, null, 2));
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
            alert('Error fetching data. Please try again.');
        }
    });
});
