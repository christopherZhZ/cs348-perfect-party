CREATE DATABASE perfect_party_db charset utf8;

CREATE TABLE perfect_party_db.Client(
	ClientID int NOT NULL AUTO_INCREMENT,
	FName varchar(64) NOT NULL,
	LName varchar(64) NOT NULL,
	Email varchar(64),
	PRIMARY KEY (ClientID)
);

CREATE TABLE perfect_party_db.Event(
	EventID int NOT NULL AUTO_INCREMENT,
	ClientID int NOT NULL,
	TypeID int NOT NULL,
	Budget decimal(20,2) NOT NULL,
	EventDate date,
	VenueID int NOT NULL,
	NumInvitees int DEFAULT 0,
	PRIMARY KEY (EventID)
);

CREATE TABLE perfect_party_db.EventType(
	TypeID int NOT NULL AUTO_INCREMENT,
	TypeName varchar(64) NOT NULL,
	BasePrice decimal(20,2) NOT NULL,
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
  PRIMARY KEY (VenueID)
);

CREATE TABLE perfect_party_db.Payment(
	EventID int NOT NULL,
	Total decimal(20,2) NOT NULL
);

CREATE TABLE perfect_party_db.PayItem(
	ItemID int NOT NULL AUTO_INCREMENT,
	ItemName varchar(64),
	ItemType enum('food','decors','host','entertainment','other'),
	ItemPrice decimal(20,2),
	PRIMARY KEY (ItemID)
);

CREATE TABLE perfect_party_db.ItemSelectRecord(
	EventID int NOT NULL,
	ItemID int NOT NULL,
	Amount int NOT NULL DEFAULT 0
);

ALTER TABLE perfect_party_db.Event ADD FOREIGN KEY (ClientID) REFERENCES Client(ClientID);
ALTER TABLE perfect_party_db.Event ADD FOREIGN KEY (VenueID) REFERENCES Venue(VenueID);
ALTER TABLE perfect_party_db.Event ADD FOREIGN KEY (TypeID) REFERENCES EventType(TypeID);
ALTER TABLE perfect_party_db.Payment ADD FOREIGN KEY (EventID) REFERENCES Event(EventID);
ALTER TABLE perfect_party_db.ItemSelectRecord ADD FOREIGN KEY (EventID) REFERENCES Event(EventID);
ALTER TABLE perfect_party_db.ItemSelectRecord ADD FOREIGN KEY (ItemID) REFERENCES PayItem(ItemID);

