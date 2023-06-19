const http = require("http");

const createUser = () =>{

    const params = {
        title: 'Mr',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '08712345678',
        email: 'johndoe@example.com',
        billingAddressLine1: 'Road1',
        billingAddressLine2: 'Street2', 
        billingTown: 'Ballivor',
        billingCounty: 'Meath',
        billingEircode: 'D273DND',
        billing_address_type: 'home',
        shippingAddressLine1: 'Street2',
        shippingAddressLine2: 'Road4',
        shippingTown: 'Mullingar',
        shippingCounty: 'Westmeath',
        shippingEircode: 'VFN3393',
        shippingAddressType:'shipping',
        shipping_address_type: 'home'
        
    }
    const queryString = Object.entries(params).map(([key,value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    
    const options = {
        hostname: 'localhost',
        port: 3500,
        path: `/create-user?${queryString}`,
        method: 'GET'
    };

    const req = http.request(options, (res)=>{
        console.log(`Create User: ${res.statusCode}`);
    }).end();
     req.on('error', (error) => {
        console.error(`Error while creating user: ${error.mess}`)
     });
     req.end();
};

const searchUsers = () =>{
    const options = {
        hostname: 'localhost', 
        port: 3500, 
        path: `/search-users?name=John`,
        method: 'GET'
    };

    http.request(options, (res)=>{
        console.log(`Search Users: ${res.statusCode}`);
    }).end();
};

//Use this to update users in the database. Change the id value at the end of the path to select which user to alter.

const updateUser = () => {
    const options = {
        hostname: 'localhost',
        port: 3500,
        path: `/update-users?phoneNumber=0254587&email=test@test.mail&title=Mrs&firstName=Peter&lastName=Jhon&addressLine1=test&addressLine2=test&town=Town&county=Fermanagh&eircode=NFSB73&address_type=billing&id=54`,
        method: 'GET'
    };

    http.request(options, (res)=>{
        console.log(`Update User: ${res.statusCode}`);
    }).end();
};



const deleteUser = () =>{
    const options = {
        hostname: 'localhost',
        port: 3500,
        path: `/delete-user?email=johndoe@example.com&phoneNumber=08712345678&firstName=John`,
        method: 'GET'
    };

    http.request(options, (res) => {
        console.log(`Delete User: ${res.statusCode}`);
    }).end();
}

createUser();
setTimeout(searchUsers, 1000);
setTimeout(updateUser,2000);
setTimeout(searchUsers, 1000);
setTimeout(deleteUser,4000);
setTimeout(searchUsers,5000);

