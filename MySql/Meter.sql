
create table Meter(
	custCNIC varchar(13),
    meterNum varchar(20) UNIQUE NOT NULL,
    meterType varchar(11) not null,
    
    constraint FK_CNIC_Meter FOREIGN KEY (custCNIC) references Customer(cnic),
    constraint PK_Meter PRIMARY KEY (custCNIC, meterNum)
);


-- Procedures:
-- Insert meter
DELIMITER //
CREATE PROCEDURE InsertMeter(
    IN p_custCNIC VARCHAR(13),
    IN p_meterType VARCHAR(11)
)
InsertMeterProcedure:BEGIN
    -- Initialize output parameters
    DECLARE p_insertStatus BOOLEAN DEFAULT FALSE;
    DECLARE p_message VARCHAR(255) DEFAULT '';
    DECLARE p_meterNum varchar(20);
    DECLARE meterCount integer;

    -- Attempt to insert data into the Meter table
    BEGIN

		DECLARE foreignKeyError CONDITION FOR SQLSTATE '23000';
        BEGIN
			DECLARE EXIT HANDLER FOR foreignKeyError
            -- Handle foreign key constraint violation
            SET p_message = 'Error: Customer with the provided CNIC does not exist.';
        END;

		SELECT COUNT(meterNum) INTO meterCount from Meter;
		SET p_meterNum = CONCAT('M' , meterCount+1);
        
        -- Insert data into the Meter table
        INSERT INTO Meter (custCNIC, meterNum, meterType)
        VALUES (p_custCNIC, p_meterNum, p_meterType);

        -- Set success message
        SET p_message = 'Meter data successfully inserted.';
        SET p_insertStatus = TRUE;
    END;
    
	SELECT p_insertStatus AS isInserted, p_message AS message;
	
END //
DELIMITER ;
