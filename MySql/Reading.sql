
create table Reading(
	meterNo varchar(20),
    readingDate date not null, -- Reading date would always be 01 of the billing month
    readingValue integer not null,
    
    constraint FK_MeterNo_Reading FOREIGN KEY (MeterNo) references Meter(MeterNum),
    constraint PK_Reading PRIMARY KEY (meterNo, readingDate),
    INDEX idx_readingDate (readingDate)
);

-- Adding rows to the Reading table with only year and month
INSERT INTO Reading (meterNo, readingDate, readingValue) VALUES
    ('M1', '2023-12-01', 130),
    ('M2', '2023-12-01', 160),
    ('M3', '2023-12-01', 140),
    ('M4', '2023-12-01', 180),
    ('M5', '2023-12-01', 170)
;


-- Procedures:

DELIMITER //
CREATE PROCEDURE InsertReadingData(
    IN p_meterNo VARCHAR(20),
    IN p_readingValue INTEGER
)
InsertReadingProcedure:BEGIN
    -- Initialize output parameters
    DECLARE p_insertStatus BOOLEAN DEFAULT FALSE;
    DECLARE p_message VARCHAR(255) DEFAULT '';
    DECLARE p_readingDate DATE;


    -- Check if readingValue is NULL
    IF p_readingValue IS NULL THEN
        SET p_message = 'Error: ReadingValue cannot be NULL.';
        LEAVE InsertReadingProcedure;
    END IF;

    -- Attempt to insert data into the Reading table
    BEGIN
        -- Declare and handle duplicate key error
        DECLARE duplicateKeyError CONDITION FOR SQLSTATE '23000';
        DECLARE foreignKeyError CONDITION FOR SQLSTATE '23000';
        
        BEGIN
			DECLARE EXIT HANDLER FOR duplicateKeyError
            SET p_message = 'Error: Reading for the provided month already exists.';
        END;
        BEGIN        
			DECLARE EXIT HANDLER FOR foreignKeyError
            SET p_message = 'Error: Meter with the provided meter number does not exist.';
        END;
        
		SET p_readingDate = DATE_FORMAT(CURDATE(), '%Y-%m-01');
		
        -- Insert data into the Reading table
        INSERT INTO Reading (meterNo, readingDate, readingValue)
        VALUES (p_meterNo, p_readingDate, p_readingValue);

        -- Set success message
        SET p_message = 'Reading data successfully inserted.';
        SET p_insertStatus = TRUE;
    END;
    
    SELECT p_insertStatus AS isInserted, p_message AS message;
END //
DELIMITER ;

-- Declare variables to hold the result
SET @insertStatus = NULL;
SET @message = NULL;

-- Call the procedure and pass the variables
CALL InsertReadingData('M12', 1807);

-- Retrieve the result
SELECT @insertStatus AS InsertStatus, @message AS Message;

DELIMITER //
CREATE TRIGGER insertIntoBill
AFTER INSERT ON Reading FOR EACH ROW
BEGIN
    DECLARE meterNo_var VARCHAR(20);
    DECLARE forConcat_var INT;
    DECLARE billNum_var VARCHAR(10);
    DECLARE billMonth_var DATE;
    DECLARE total_var DECIMAL(10, 2);
    DECLARE dueDate_var DATE;

    -- Get values from the inserted row
    SET meterNo_var = NEW.meterNo;
    SELECT COUNT(billNum) INTO forConcat_var from Bill;
    SET billNum_var = CONCAT('B0', forConcat_var + 1);
    SET billMonth_var = NEW.readingDate;
    SET total_var = (SELECT rate FROM tarrif WHERE tarrifType = (SELECT meterType FROM Meter WHERE meterNum = NEW.meterNo)) * NEW.readingValue;
    SET dueDate_var = DATE_ADD(NEW.readingDate, INTERVAL 20 DAY);

    -- Insert values into the Bill table
    INSERT INTO Bill (meterNo, billNum, billMonth, total, dueDate)
    VALUES (meterNo_var, billNum_var, billMonth_var, total_var, dueDate_var);
END;
//
DELIMITER ;

