const http = require('http');
const url = require("url");
const crud = require("./functions.js");

const server = http.createServer((req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type');

    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;

    switch(parsedUrl.pathname){
        case '/create-user':
            
            const userData = {
                title: query.title,
                firstName: query.firstName,
                lastName: query.lastName,
                phoneNumber: query.phoneNumber,
                email: query.email,
                billingAddressLine1: query.billingAddressLine1,
                billingAddressLine2: query.billingAddressLine2,
                billingTown: query.billingTown,
                billingCounty: query.billingCounty,
                billingEircode: query.billingEircode,
                billing_address_type: query.billing_address_type,
                shippingAddressLine1: query.shippingAddressLine1,
                shippingAddressLine2: query.shippingAddressLine2,
                shippingTown: query.shippingTown,
                shippingCounty: query.shippingTown,
                shippingEircode: query.shippingEircode,
                shippingAddressType: query.shipping_address_Type,
                shipping_address_type: query.shipping_address_type

            };

            crud.createUser(userData, (err, result)=>{
                if(err){
                    console.error('Error in createUser: ', err);
                    res.writeHead(500, {'Content-Type' : 'text/plain'});
                    res.end('Error: '+err.message);
                }else{
                    res.setHeader('Access-Control-Allow-Origin','*');
                    res.writeHead(200, {'Content-Type':'application/json'});
                    res.end(JSON.stringify(result));
                }
            });

            break;

            case '/search-users':
            const searchName = query.name;

            crud.findUserByName(searchName, (err, users)=> {
                if(err){
                    res.writeHead(500, {'Content-Type':'text/plain'});
                    res.end('Error: '+ err.message);
                }else{
                    res.writeHead(200, {'Content-Type':'application/json'});
                    res.end(JSON.stringify(users));
                }
            });

            break;

            case '/update-users':
            const userId = parseInt(query.id, 10);
            const updatedData = {
                phoneNumber: query.phoneNumber,
                email: query.email, 
                title: query.title,
                firstName: query.firstName,
                lastName: query.lastName,
                address: {
                    addressLine1: query.addressLine1,
                    addressLine2: query.addressLine2,
                    town: query.town,
                    county: query.county, 
                    eircode: query.eircode,
                    address_type: query.address_type,
                }
            };

            crud.updateUser(userId, updatedData, (err, result)=>{
                if(err){
                    res.writeHead(500, {'Content-Type':'text/plain'});
                    res.end('Error: '+err.message);
                }else{
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end('User updated successfully');
                }
            });

            break;

            case '/delete-user':

            const userEmail = query.email;
            const userPhone = query.phoneNumber;
            const userName = query.firstName;

            findUserIdByEmailPhoneName(userEmail, userPhone, userName, (err, userId) => {
                if(err){
                    res.writeHead(500, {'Content-Type':'text/plain'});
                    res.end('Error: '+err.message);
                }else{
                    crud.deleteUser(userId, (err, result)=>{
                        if(err){
                            res.writeHead(500, {'Content-Type':'text/plain'});
                            res.end('Error: '+err.message);
                        }else{
                            res.writeHead(200, {'Content-Type':'text/plain'});
                            res.end('User Deleted');
                        }
                    });
                }
            });
            
            break;

            default: 
            res.writeHead(404, {'Content-Type':'textPlain'});
            res.end("Not Found");
    }
});

function findUserIdByEmailPhoneName(email,phone,name, callback){
    crud.findUserByName(name, (err, users)=>{
        if(err){
            return callback(err);
        }

        const foundUser = users.find(
            (user) => user.email === email && user.phoneNumber === phone
        );

        if(foundUser){
            callback(null, foundUser.id);
        }else{
            callback(new Error("User not found"));
        }

    });
    
}

server.listen(3500, ()=>{
    console.log("Server listening on port 3500");
})