const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MySqlPassword',
    database: 'ebs'
});


connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});


app.get('/getData', (req, res) => {
    connection.query('SELECT * FROM Customer', (err, results, fields) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Process the results
        console.log('Query results:', results);

        res.json(results);
    });
});


// Authenticate Employee:
app.post('/authenticate', (req, res) => {
    const { username, password } = req.body;

    connection.query(
        'CALL AuthenticateUser(?, ?, ?)',
        [username, password, 'employee'],
        (error, results) => {
            if (error) {
                console.error('Error during authentication:', error);
                return res.status(500).json({
                    isAuthenticated: false,
                    authMessage: 'Error during authentication',
                });
            }
            
            console.log("test" + JSON.stringify(results));

            if (results[0] && results[0][0]) {
                var isAuthenticated = results[0][0].IsAuthenticated;
                var authMessage = results[0][0].AuthMessage;
                
            } else {
                console.error('No data returned from the stored procedure');
                return res.status(500).json({
                    isAuthenticated: false,
                    authMessage: 'Error during authentication',
                });
            }

            if (isAuthenticated) {
                console.log('Login Successful!');
            } else {
                console.log('Login Failed!');
            }
            res.json({
                isAuthenticated,
                authMessage,
            });

        }
    );
});


// Add Customer:
app.post('/addCustomer', (req, res) => {
    const { custName, cnic, password, custAddress, custCity, custProvince, custZip } = req.body;

    connection.query(
        'CALL InsertCustomer(?, ?, ?, ?, ?, ?, ?)',
        [custName, cnic, password, custAddress, custCity, custProvince, custZip],
        (error, results) => {
            if (error) {
                console.error('Error during customer addition:', error);
                return res.status(500).json({
                    isCustomerAdded: false,
                    message: 'Error during customer addition',
                });
            }

            console.log("test" + JSON.stringify(results));

            if (results[0] && results[0][0]) {
                var isCustomerAdded = results[0][0].isCustomerAdded;
                var message = results[0][0].message;

            } else {
                console.error('No data returned from the stored procedure');
                return res.status(500).json({
                    isCustomerAdded: false,
                    message: 'Error during customer addition',
                });
            }

            if (isCustomerAdded) {
                console.log('Customer Added Successfully!');
            } else {
                console.log('Failed to add customer');
            }

            res.json({
                isCustomerAdded,
                message,
            });
        }
    );
});



// Delete Customer
// Add the following route for handling customer deletion
app.post('/deleteCustomer', (req, res) => {
    const { cnic } = req.body;

    connection.query(
        'CALL DeleteCustomer(?)',
        [cnic],
        (error, results) => {
            if (error) {
                console.error('Error during customer deletion:', error);
                return res.status(500).json({
                    deleteStatus: false,
                    message: 'Error during customer deletion',
                });
            }

            console.log("test" + JSON.stringify(results));

            if (results[0] && results[0][0]) {
                var deleteStatus = results[0][0].deleteStatus;
                var message = results[0][0].message;
            } else {
                console.error('No data returned from the stored procedure');
                return res.status(500).json({
                    deleteStatus: false,
                    message: 'Error during customer deletion',
                });
            }

            if (deleteStatus) {
                console.log('Customer Deleted Successfully!');
            } else {
                console.log('Failed to delete customer');
            }

            res.json({
                deleteStatus,
                message,
            });
        }
    );
});



// Add Meter
app.post('/addMeter', (req, res) => {
    const { custCNIC, meterType } = req.body;

    connection.query(
        'CALL InsertMeter(?, ?)',
        [custCNIC, meterType],
        (error, results) => {
            if (error) {
                console.error('Error during meter addition:', error);
                return res.status(500).json({
                    isInserted: false,
                    message: 'Error during meter addition',
                });
            }

            if (results[0] && results[0][0]) {
                var isInserted = results[0][0].isInserted;
                var message = results[0][0].message;
            } else {
                console.error('No data returned from the stored procedure');
                return res.status(500).json({
                    isInserted: false,
                    message: 'Error during meter addition',
                });
            }

            if (isInserted) {
                console.log('Meter Added Successfully!');
            } else {
                console.log('Failed to add meter');
            }

            res.json({
                isInserted,
                message,
            });
        }
    );
});

// Add Reading
app.post('/insertReading', (req, res) => {
    const { meterNo, readingValue } = req.body;

    connection.query(
        'CALL InsertReadingData(?, ?)',
        [meterNo, readingValue],
        (error, results) => {
            if (error) {
                console.error('Error during reading insertion:', error);
                return res.status(500).json({
                    isInserted: false,
                    message: 'Error during reading insertion',
                });
            }

            console.log("test" + JSON.stringify(results));

            if (results[0] && results[0][0]) {
                var isInserted = results[0][0].isInserted;
                var message = results[0][0].message;
            } else {
                console.error('No data returned from the stored procedure');
                return res.status(500).json({
                    isInserted: false,
                    message: 'Error during reading insertion',
                });
            }

            if (isInserted) {
                console.log('Reading Inserted Successfully!');
            } else {
                console.log('Failed to insert reading');
            }

            res.json({
                isInserted,
                message,
            });
        }
    );
});



// Update Tarrif
app.post('/updateTarrif', (req, res) => {
    const { comTarrif, domTarrif } = req.body;

    // Query to update data in MySQL table
    const query = "UPDATE tarrif SET rate = CASE WHEN tarrifType = 'Commercial' THEN ? WHEN tarrifType = 'Domestic' THEN ? END WHERE tarrifType IN ('Commercial', 'Domestic')";
    // Executing the query with parameters
    connection.query(query, [comTarrif, domTarrif], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        console.log("test" + JSON.stringify(results));

        // Check if any rows were affected
        if (results.affectedRows === 0) {
            console.log('No rows were updated');
            return res.status(404).json({ error: 'No rows were updated' });
        }

        res.json({ success: true });
    });
});

//billLogPage connection and fetching
app.post('/fetchData', (req, res) => {
    const { meterNum } = req.body;

    // Modify your query to join the necessary tables and fetch required columns
    const query = `
        SELECT
            Customer.custName AS 'Customer Name',
            Meter.meterType AS 'Meter Type',
            Bill.meterNo AS 'Meter #',
            Bill.billNum AS 'Bill #',
            DATE_FORMAT(Bill.billMonth, "%Y-%m") AS 'Billing Month',
            Bill.total AS 'Total',
            DATE_FORMAT(Bill.dueDate, "%Y-%m-%d") AS 'Due Date'
            
        FROM Bill
        JOIN Meter ON Bill.meterNo = Meter.meterNum
        JOIN Customer ON Meter.custCNIC = Customer.cnic
        WHERE Bill.meterNo = ?
        ORDER BY Bill.billMonth DESC
    `;

    connection.query(query, [meterNum], (error, results) => {
        if (error) {
            console.error('Error fetching data from database:', error);
            return res.status(500).json({
                error: 'Error fetching data from database',
            });
        }

        if (results.length > 0) {
            // Data found, return it as JSON
            const data = results[0];
            res.json(data);
        } else {
            // No data found
            res.json({ error: 'No data found' });
        }
    });
});



//recordLogPage data fetching endpoint
app.post('/fetchRecord', (req, res) => {
    const { meterNum } = req.body;

    const query = `
        SELECT
            Customer.custName AS 'Customer Name',
            Meter.meterType AS 'Meter Type',
            Bill.meterNo AS 'Meter #',
            Bill.billNum AS 'Bill #',
            DATE_FORMAT(Bill.billMonth, "%Y-%m") AS 'Billing Month',
            Bill.total AS 'Total',
            DATE_FORMAT(Bill.dueDate, "%Y-%m-%d") AS 'Due Date'

        FROM Bill
        JOIN Meter ON Bill.meterNo = Meter.meterNum
        JOIN Customer ON Meter.custCNIC = Customer.cnic
        WHERE Bill.meterNo = ?
        ORDER BY Bill.billMonth DESC
    `;

    connection.query(query, [meterNum], (error, results) => {
        if (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Error fetching data from the database' });
        } else {
            res.json(results);
        }
    });
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app; // Export the app for testing purposes


// Close the database connection when the server is stopped
process.on('SIGINT', () => {
    connection.end((err) => {
        if (err) {
            console.error('Error closing MySQL connection:', err);
            process.exit(1);
        }
        console.log('MySQL connection closed');
        process.exit(0);
    });
});

