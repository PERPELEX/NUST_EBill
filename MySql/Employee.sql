create table Employee(
	loginID varchar(30),
    password varchar(30) not null,
    
    constraint PK_Employee PRIMARY KEY (loginID)
);

INSERT INTO Employee VALUES ('admin', 'adminpass');

-- Procedures:
-- Employee and Customer Authentication:
DELIMITER //
CREATE PROCEDURE AuthenticateUser(
    IN p_loginID VARCHAR(30),
    IN p_password VARCHAR(30),
    IN p_userType VARCHAR(10)
)
BEGIN
    -- Initialize the output parameters
    DECLARE isAuthenticated BOOLEAN DEFAULT FALSE;
    DECLARE authMessage VARCHAR(255) DEFAULT '';

    -- Check if the user is an employee
    IF p_userType = 'employee' THEN
        -- Check if the employee exists
        IF EXISTS (
            SELECT 1
            FROM Employee
            WHERE loginID = p_loginID
        ) THEN
            -- Check employee authentication
            IF EXISTS (
                SELECT 1
                FROM Employee
                WHERE loginID = p_loginID AND password = p_password
            ) THEN
                SET isAuthenticated = TRUE;
                SET authMessage = 'Employee authenticated successfully.';
            ELSE
                SET authMessage = 'Incorrect password for the employee.';
            END IF;
        ELSE
            SET authMessage = 'Employee not found.';
        END IF;

    -- Check if the user is a customer
    ELSEIF p_userType = 'customer' THEN
        -- Check if the customer exists
        IF EXISTS (
            SELECT 1
            FROM Customer
            WHERE cnic = p_loginID
        ) THEN
            -- Check customer authentication
            IF EXISTS (
                SELECT 1
                FROM Customer
                WHERE cnic = p_loginID AND password = p_password
            ) THEN
                SET isAuthenticated = TRUE;
                SET authMessage = 'Customer authenticated successfully.';
            ELSE
                SET authMessage = 'Incorrect password for the customer.';
            END IF;
        ELSE
            SET authMessage = 'Customer not found.';
        END IF;
    END IF;
    
    SELECT isAuthenticated AS IsAuthenticated, authMessage AS AuthMessage;
    
END //
DELIMITER ;
