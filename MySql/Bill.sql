
create table Bill(
	meterNo varchar(20),
    billNum varchar(10) UNIQUE not null,
    billMonth date not null,
    total decimal,
    dueDate date not null, -- Due-date would always be 20 of the billing month
    
    constraint FK_metNo_Bill FOREIGN KEY (meterNo) references Meter(meterNum),
    constraint PK_Bill PRIMARY KEY (meterNo, billNum),
    constraint FA_Month_Bill FOREIGN KEY (billMonth) references Reading(readingDate)
);
