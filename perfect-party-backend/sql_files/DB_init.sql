CREATE DATABASE perfect_party_db charset utf8;

CREATE TABLE perfect_party_db.Client(
	ClientID int NOT NULL AUTO_INCREMENT,
	FName varchar(64) NOT NULL,
	LName varchar(64) NOT NULL,
	Email varchar(64),
	Active boolean DEFAULT 1,
	PRIMARY KEY (ClientID)
);

CREATE TABLE perfect_party_db.Event(
	EventID int NOT NULL AUTO_INCREMENT,
	ClientID int,
	TypeID int,
	Budget decimal(20,2) NOT NULL,
	EventDate date,
	VenueID int,
	NumInvitees int DEFAULT 0,
	PRIMARY KEY (EventID)
);

CREATE TABLE perfect_party_db.EventType(
	TypeID int NOT NULL AUTO_INCREMENT,
	TypeName varchar(64) NOT NULL,
	BasePrice decimal(20,2) NOT NULL,
	Active boolean DEFAULT 1,
	PRIMARY KEY (TypeID)
);

CREATE TABLE perfect_party_db.Supplier(
	SupplierID int NOT NULL AUTO_INCREMENT,
	Name varchar(64) NOT NULL,
	OfferedType enum('food','decors','host','entertainment','other'),
	PRIMARY KEY (SupplierID)
);

CREATE TABLE perfect_party_db.Venue(
  VenueID int NOT NULL AUTO_INCREMENT,
  Name varchar(64) NOT NULL,
  Address varchar(128) NOT NULL,
  Price decimal(20,2) NOT NULL,
  Active boolean DEFAULT 1,
  PRIMARY KEY (VenueID)
);

CREATE TABLE perfect_party_db.Payment(
    PaymentID int NOT NULL AUTO_INCREMENT,
	EventID int,
	Total decimal(20,2) NOT NULL,
	PRIMARY KEY (PaymentID)
);

CREATE TABLE perfect_party_db.PayItem(
	ItemID int NOT NULL AUTO_INCREMENT,
	ItemName varchar(64) NOT NULL,
	ItemType enum('food','decors','host','entertainment','other'),
	ItemPrice decimal(20,2) NOT NULL,
    SupplierID int,
    Active boolean DEFAULT 1,
    PRIMARY KEY (ItemID)
);

CREATE TABLE perfect_party_db.ItemSelectRecord(
    RecordID int NOT NULL AUTO_INCREMENT,
	EventID int,
	ItemID int,
	Amount int NOT NULL DEFAULT 0,
	PRIMARY KEY (RecordID)
);

use perfect_party_db;

ALTER TABLE Event ADD FOREIGN KEY (ClientID)
	REFERENCES Client(ClientID)
	ON DELETE SET NULL
	ON UPDATE CASCADE;

ALTER TABLE Event ADD FOREIGN KEY (VenueID)
	REFERENCES Venue(VenueID)
	ON DELETE SET NULL
	ON UPDATE CASCADE;

ALTER TABLE Event ADD FOREIGN KEY (TypeID)
	REFERENCES EventType(TypeID)
	ON DELETE SET NULL
	ON UPDATE CASCADE;

ALTER TABLE Payment ADD FOREIGN KEY (EventID)
	REFERENCES Event(EventID)
	ON DELETE CASCADE
	ON UPDATE CASCADE;

ALTER TABLE PayItem ADD FOREIGN KEY (SupplierID)
	REFERENCES Supplier(SupplierID)
	ON DELETE SET NULL
	ON UPDATE CASCADE;

ALTER TABLE ItemSelectRecord ADD FOREIGN KEY (EventID)
	REFERENCES Event(EventID)
	ON DELETE CASCADE
	ON UPDATE CASCADE;

ALTER TABLE ItemSelectRecord ADD FOREIGN KEY (ItemID)
	REFERENCES PayItem(ItemID)
	ON DELETE SET NULL
	ON UPDATE CASCADE;
