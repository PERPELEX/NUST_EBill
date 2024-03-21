create table Tarrif(
	tarrifType varchar(10),
	rate decimal(5, 2)  not null,
    
    constraint PK_Tarrif PRIMARY KEY (tarrifType)
);

INSERT INTO Tarrif VALUES ('Domestic', 10), ('Commercial', 15);

-- Procedures:

DELIMITER //
CREATE PROCEDURE UpdateTarrifRate(
    IN p_tarrifType VARCHAR(10),
    IN p_newRate DECIMAL(5, 2),
    OUT p_updateStatus BOOLEAN,
    OUT p_message VARCHAR(255)
)
UpdateTarrifProcedure: BEGIN
    -- Initialize output parameters
    SET p_updateStatus = FALSE;
    SET p_message = '';

    -- Check if p_newRate is NULL
    IF p_newRate IS NULL or p_newRate = 0 THEN
        SET p_message = 'Update Failed! No new value found.';
        SET p_updateStatus = FALSE;
        LEAVE UpdateTarrifProcedure;
    END IF;

    -- Attempt to update data in the Tarrif table
    BEGIN
		-- Update data in the Tarrif table
        UPDATE Tarrif SET rate = p_newRate WHERE tarrifType = p_tarrifType;

        -- Check if any rows were affected
        IF ROW_COUNT() > 0 THEN
            SET p_updateStatus = TRUE;
            SET p_message = 'Tarrif data successfully updated.';
        ELSE
            SET p_message = 'Error: Update Failed!';
        END IF;
    END;
END //
DELIMITER ;
