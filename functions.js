//const { beginTransaction } = require('./db');
const connection = require('./databaseConnection');

//Function below to create users

exports.createUser = (userData, callback) =>{
    const user_personal_informationQuery = `INSERT INTO userPersonalInformation (title, firstName, lastName, phoneNumber, email) VALUES (?,?,?,?,?)`;

    const user_addressQuery = `INSERT INTO userAddress (userID, addressLine1, addressLine2, town, countyCity, eircode, address_type) VALUES (?,?,?,?,?,?,?)`;

    connection.beginTransaction((err)=>{
        if(err){
            return callback(err);
        }

        connection.query(
            user_personal_informationQuery,
            [
                userData.title,
                userData.firstName,
                userData.lastName,
                userData.phoneNumber,
                userData.email,
            ],
            (err, user_personal_informationResult)=>{
                if(err){
                    return connection.rollback(()=>callback(err));
                }

                const user_id = user_personal_informationResult.insertId;

                connection.query(
                    user_addressQuery,
                    [
                        user_id,
                        userData.billingAddressLine1,
                        userData.billingAddressLine2,
                        userData.billingTown,
                        userData.billingCounty,
                        userData.billingEircode,
                        userData.billing_address_type,

                    ],
                    (err) => {
                        if(err){
                            return connection.rollback(()=>callback(err));
                        }

                        connection.query(
                            user_addressQuery,
                            [
                                user_id,
                                userData.shippingAddressLine1,
                                userData.shippingAddressLine2,
                                userData.shippingTown,
                                userData.shippingCounty,
                                userData.shippingEircode,
                                userData.shipping_address_type,
                            ],
                            (err) => {
                                if(err){
                                    return connection.rollback(()=> callback(err));
                                }

                                connection.commit((err)=>{
                                    if(err){
                                        return connection.rollback(()=> callback(err));
                                    }
                                    callback(null, {user_id});
                                });
                                
                            }
                        );
                    }
                );
            }
        );
    });
};

//function below to find users by name

exports.findUserByName =(name, callback)=>{
    const searchQuery =`
SELECT userPersonalInformation.id, userPersonalInformation.title, userPersonalInformation.firstName, userPersonalInformation.lastName,
userPersonalInformation.phoneNumber, userPersonalInformation.email, userAddress.addressLine1, userAddress.addressLine2, userAddress.town, 
userAddress.countyCity, userAddress.eircode, userAddress.address_type
FROM userPersonalInformation
JOIN userAddress ON userPersonalInformation.id = userAddress.userID
WHERE userPersonalInformation.firstName LIKE ? OR userPersonalInformation.lastName LIKE ?`;

    const searchName = `%${name}%`;

    connection.query(searchQuery, [searchName, searchName], (err, results)=>{
        if(err){
            return callback(err);
        }

        const users = results.map((row)=>({
            id: row.id,
            title: row.title,
            firstName: row.firstName,
            lastName: row.lastName,
            phoneNumber: row.phoneNumber,
            email: row.email,

            userAddresses: {
                userAddressLine1: row.userAddressLine1,
                userAddressLine2: row.userAddressLine2,
                town: row.town,
                county: row.countyCity,
                eircode: row.eircode,
                addressType: row.addressType,
            },
        }));

        callback(null, users);
    });
    
};

//function below to update users based on their id
exports.updateUser = (id, updateUser, callback)=>{
    const updateuser_personal_informationQuery = `
    UPDATE userPersonalInformation
    SET title = ?, firstName = ?, lastName = ?, phoneNumber = ?, email =?
    WHERE id = ?`;

    const updateuser_addressQuery = `
    UPDATE userAddress
    SET addressLine1 = ?, addressLine2 = ?, town = ?, countyCity = ?, eircode = ?, address_type = ?
    WHERE userID = ?`;

    connection.beginTransaction((err)=>{
        if(err){
            return callback(err);
        }

        connection.query(
            updateuser_personal_informationQuery,
            [
                updateUser.title,
                updateUser.firstName,
                updateUser.lastName,
                updateUser.phoneNumber,
                updateUser.email,
                id,
            ],
            (err, result)=>{
                if(err){
                    return connection.rollback(()=>{
                        callback(err);
                    });
                }

                connection.query(
                    updateuser_addressQuery,
                    [
                        updateUser.address.addressLine1,
                        updateUser.address.addressLine2,
                        updateUser.address.town,
                        updateUser.address.countyCity,
                        updateUser.address.eircode,
                        updateUser.address.address_type,   
                        id,
                    ],
                    (err, result)=>{
                        if(err){
                            return connection.rollback(()=>{
                                callback(err);
                            });
                        }
        
                        connection.commit((err)=>{
                            if(err){
                                return connection.rollback(()=>{
                                    callback(err);
                                });
                            }
        
                            callback(null, result);
                        });
                    }
                )

            });
        
    })
};


// function below to delete users based on their ID. I have cascading delete enabled so both tables will be removed of data

exports.deleteUser = (userID, callback) => {
    const deleteuser_addressQuery = `
    DELETE FROM userAddress
    WHERE userID = ?`;

    const deleteuser_personal_informationQuery = `
    DELETE FROM userPersonalInformation
    WHERE id = ?`;

    connection.beginTransaction((err) => {
        if (err) {
            return callback(err);
        }

        connection.query(deleteuser_personal_informationQuery, [userID], (err, result) => {
            if (err) {
                return connection.rollback(() => {
                    callback(err);
                });
            }

            connection.query(deleteuser_addressQuery, [userID], (err, result) => {
                if (err) {
                    return connection.rollback(() => {
                        callback(err);
                    });
                }

                connection.commit((err) => {
                    if (err) {
                        return connection.rollback(() => {
                            callback(err);
                        });
                    }

                    callback(null, result);
                });
            });
        });
    });
};