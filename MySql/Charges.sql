create table Charges(
	chargeName varchar(30),
	amount decimal(5, 2) not null,
    
    constraint PK_Charges PRIMARY KEY (chargeName)
);

INSERT INTO Charges VALUES 
	('Sales Tax', 1.5),			-- Sales Tax per Unit
    ('Other Charges', 150)		-- To be included as it is
;

DELIMITER //
CREATE PROCEDURE InsertChargesData(
    IN p_chargeName VARCHAR(30),
    IN p_amount DECIMAL(5, 2),
    OUT p_insertStatus BOOLEAN,
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE duplicateKeyError CONDITION FOR SQLSTATE '23000';

    -- Initialize output parameters
    SET p_insertStatus = FALSE;
    SET p_message = '';

    -- Attempt to insert data into the Charges table
    BEGIN
        -- Declare and handle duplicate key error
        DECLARE EXIT HANDLER FOR duplicateKeyError
		SET p_message = 'Error: ChargeName already exists.';

        -- Insert data into the Charges table
        INSERT INTO Charges (chargeName, amount)
        VALUES (p_chargeName, p_amount);

        -- Set success message
        SET p_message = 'Charge data successfully inserted.';
        SET p_insertStatus = TRUE;
    END;
END //
DELIMITER ;

-- Declare variables to hold the result
SET @insertStatus = NULL;
SET @message = NULL;

-- Call the procedure and pass the variables
CALL InsertChargesData('ChargeA', 25.00, @insertStatus, @message);

-- Retrieve the result
SELECT @insertStatus AS InsertStatus, @message AS Message;

-- Update Charges:
DELIMITER //
CREATE PROCEDURE UpdateChargeAmount(
    IN p_chargeName VARCHAR(30),
    IN p_newAmount DECIMAL(5, 2),
    OUT p_updateStatus BOOLEAN,
    OUT p_message VARCHAR(255)
)
UpdateChargeAmountProcedure: BEGIN
    -- Initialize output parameters
    SET p_updateStatus = FALSE;
    SET p_message = '';

    -- Check if p_newAmount is NULL
    IF p_newAmount IS NULL THEN
        SET p_message = 'Warning: New amount is NULL. No update performed.';
        SET p_updateStatus = FALSE;
        LEAVE UpdateChargeAmountProcedure;
    END IF;

    -- Attempt to update data in the Charges table
    BEGIN
		-- Update data in the Charges table
        UPDATE Charges SET amount = p_newAmount WHERE chargeName = p_chargeName;

        -- Check if any rows were affected
        IF ROW_COUNT() > 0 THEN
            SET p_updateStatus = TRUE;
            SET p_message = 'Charge data successfully updated.';
        ELSE
            SET p_message = 'Update Failed! Charge not found.';
        END IF;
    END;
END //
DELIMITER ;

-- Declare variables to hold the result
SET @updateStatus = NULL;
SET @message = NULL;

-- Call the procedure and pass the variables
CALL UpdateChargeAmount('ChargeA', 25.50, @updateStatus, @message);

-- Retrieve the result
SELECT @updateStatus AS UpdateStatus, @message AS Message;


-- Delete Charges:
DELIMITER //
CREATE PROCEDURE DeleteCharge(
    IN p_chargeName VARCHAR(30),
    OUT p_deleteStatus BOOLEAN,
    OUT p_message VARCHAR(255)
)
BEGIN
    -- Initialize output parameters
    SET p_deleteStatus = FALSE;
    SET p_message = '';

    -- Attempt to delete the row from the Charges table
    -- Delete the row based on the provided chargeName
    DELETE FROM Charges WHERE chargeName = p_chargeName;

    -- Check if any rows were affected
    IF ROW_COUNT() > 0 THEN
        SET p_deleteStatus = TRUE;
        SET p_message = 'Charge data successfully deleted.';
    ELSE
        SET p_message = 'No matching ChargeName found for deletion.';
    END IF;
END //
DELIMITER ;

-- Declare variables to hold the result
SET @deleteStatus = NULL;
SET @message = NULL;

-- Call the procedure and pass the variables
CALL DeleteCharge('ChargeA', @deleteStatus, @message);

-- Retrieve the result
SELECT @deleteStatus AS DeleteStatus, @message AS Message;
