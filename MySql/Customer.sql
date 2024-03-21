
create table Customer(
	custName varchar(50) not null,
    cnic varchar(13) ,
    password varchar(30) not null,
    custAddress varchar(100),
    custCity varchar(30),
    custProvince varchar(50),
    custZip varchar(10),
    
    constraint PK_Customer PRIMARY KEY (cnic)
);

INSERT INTO Customer (custName, cnic, password, custAddress, custCity, custProvince, custZip) VALUES
	('Ali', '1111111111111', 'passali', 'Street 1, House 1', 'Karachi', 'Sindh', '12345'),
	('Bilal', '2222222222222', 'passbilal', 'Street 2, House 2', 'Lahore', 'Punjab', '23456'),
	('Cathy', '3333333333333', 'passcathy', 'Street 3, House 3', 'Islamabad', 'Capital', '34567'),
	('Danish', '4444444444444', 'passdanish', 'Street 4, House 4', 'Peshawar', 'Khyber Pakhtunkhwa', '45678'),
	('Esha', '5555555555555', 'passesha', 'Street 5, House 5', 'Quetta', 'Balochistan', '56789')
;

-- Insert Customer:
DELIMITER //
CREATE PROCEDURE InsertCustomer(
    IN p_custName VARCHAR(50),
    IN p_cnic VARCHAR(13),
    IN p_password VARCHAR(30),
    IN p_custAddress VARCHAR(100),
    IN p_custCity VARCHAR(30),
    IN p_custProvince VARCHAR(50),
    IN p_custZip VARCHAR(10)
)
BEGIN
    -- Initialize the output parameters
    DECLARE p_insertStatus BOOLEAN DEFAULT FALSE;
    DECLARE p_message VARCHAR(255) DEFAULT '';
    
    DECLARE duplicateKeyError CONDITION FOR SQLSTATE '23000';

    -- Set a default name if not provided
    IF p_custName IS NULL OR p_custName = '' THEN
        SET p_custName = 'Unknown Customer';
    END IF;

    -- Attempt to insert the customer
    BEGIN
        DECLARE EXIT HANDLER FOR duplicateKeyError
        BEGIN
            -- Handle duplicate key error (assuming cnic is unique)
            SET p_message = 'Error: Customer with the provided CNIC already exists.';
        END;

        -- Insert customer into the table
        INSERT INTO Customer (custName, cnic, password, custAddress, custCity, custProvince, custZip)
        VALUES (p_custName, p_cnic, p_password, p_custAddress, p_custCity, p_custProvince, p_custZip);

        -- Set success message
        SET p_message = 'Customer successfully inserted.';
        SET p_insertStatus = TRUE;
    END;

    SELECT p_insertStatus AS isCustomerAdded, p_message AS message;
END //
DELIMITER ;



-- Update customer details:
DELIMITER //
CREATE PROCEDURE UpdateCustomerDetails(
    IN p_cnic VARCHAR(13),
    IN p_newCustName VARCHAR(50),
    IN p_newCustAddress VARCHAR(100),
    IN p_newCustCity VARCHAR(30),
    IN p_newCustProvince VARCHAR(50),
    IN p_newCustZip VARCHAR(10)
)
BEGIN
    -- Initialize the output parameters
	DECLARE p_updateStatus BOOLEAN DEFAULT FALSE;
    DECLARE p_message VARCHAR(255) DEFAULT '';

    -- Check if the customer with the provided CNIC exists
    IF EXISTS (SELECT 1 FROM Customer WHERE cnic = p_cnic) THEN
        -- Update customer details based on provided values
        UPDATE Customer
        SET
            custName = COALESCE(p_newCustName, custName),
            custAddress = COALESCE(p_newCustAddress, custAddress),
            custCity = COALESCE(p_newCustCity, custCity),
            custProvince = COALESCE(p_newCustProvince, custProvince),
            custZip = COALESCE(p_newCustZip, custZip)
        WHERE cnic = p_cnic;

        -- Set success message
        SET p_updateStatus = TRUE;
        SET p_message = 'Customer details updated successfully.';

    ELSE
        SET p_message = 'Customer with the provided CNIC does not exist.';
    END IF;
    
    SELECT p_updateStatus AS updateStatus, p_message AS message;
END //
DELIMITER ;


-- Delete Customer:
DELIMITER //
CREATE PROCEDURE DeleteCustomer(
    IN p_cnic VARCHAR(13)
)
BEGIN
    -- Initialize the output parameters
    DECLARE p_deleteStatus BOOLEAN DEFAULT FALSE;
    DECLARE p_message VARCHAR(255) DEFAULT '';

    -- Check if the customer with the provided CNIC exists
    IF EXISTS (SELECT 1 FROM Customer WHERE cnic = p_cnic) THEN
        -- Delete customer
        DELETE FROM Customer WHERE cnic = p_cnic;

        -- Set success message
        SET p_deleteStatus = TRUE;
        SET p_message = 'Customer deleted successfully.';
    ELSE
        SET p_message = 'Customer with the provided CNIC does not exist.';
    END IF;

    -- Return output parameters
    SELECT p_deleteStatus AS deleteStatus, p_message AS message;
END //
DELIMITER ;


-- Trigger to delete meter when deleting customer
DELIMITER //
CREATE TRIGGER deleteMeterTrigger
BEFORE DELETE ON Customer
FOR EACH ROW
BEGIN
    DECLARE n INT;
    DECLARE reading_meterNo VARCHAR(20);

    -- Disable foreign key checks temporarily to avoid constraint errors
    SET foreign_key_checks = 0;

    -- Delete bills first
    DELETE b
    FROM Bill b
    JOIN Reading r ON b.billMonth = r.readingDate
    WHERE r.meterNo IN (SELECT meterNum FROM Meter WHERE custCNIC = OLD.cnic);

    -- Delete readings
    DELETE FROM Reading WHERE meterNo IN (SELECT meterNum FROM Meter WHERE custCNIC = OLD.cnic);

    -- Delete meters
    DELETE FROM Meter WHERE custCNIC = OLD.cnic;

    -- Enable foreign key checks
    SET foreign_key_checks = 1;

END;
//
DELIMITER ;
