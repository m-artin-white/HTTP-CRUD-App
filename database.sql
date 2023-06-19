CREATE DATABASE IF NOT EXISTS USERS

USE USERS;

CREATE TABLE IF NOT EXISTS userPersonalInformation(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(10) NOT NULL,
    firstName VARCHAR(50) NOT NULL, 
    lastName VARCHAR(50) NOT NULL, 
    phoneNumber VARCHAR(20) NOT NULL, 
    email VARCHAR(50) NOT NULL
)

CREATE TABLE IF NOT EXISTS userAddress(
    id INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL, 
    addressLine1 VARCHAR(100) NOT NULL,
    addressLine2 VARCHAR(100) NOT NULL,
    town VARCHAR(50) NOT NULL,
    countyCity VARCHAR(50) NOT NULL,
    eircode VARCHAR(10) NOT NULL,
    address_type ENUM('billing','shipping'),
)

ALTER TABLE userAddress
ADD CONSTRAINT fk
FOREIGN KEY (userID)
REFERENCES userPersonalInformation(id)
ON DELETE CASCADE;