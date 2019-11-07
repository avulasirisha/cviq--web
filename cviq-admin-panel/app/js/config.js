if( window.location.hostname == "localhost"  ){
        api_url = 'http://localhost:8000' ;
}else{
        api_url = 'http://34.207.125.7:3005' ;
}

App.constant("MY_CONSTANT", {



  //  "url_cviq":"http://52.24.206.96:3001"                // dev
   // "url_cviq":"http://52.24.206.96:3002"                  // test

    "url_cviq": api_url   // dev
    //"url":"http://autoverdi.clicklabs.in:7777",
    //"url_booking": "http://autoverdi.clicklabs.in:6666"    //geofencing

});

App.constant("promoCode", {
    "APP": "In App",
    "SIGNUP": "Sign Up"
});

App.constant("countryName", {
    "NAME":"INDIA"
});
App.constant("MapLatLong", {
    "lat": 57.1910499,
    "lng": -2.0834466
});

App.constant("responseCode", {
    "SUCCESS": 200,
    "PARAMETER_MISSING": 100,
    "SHOW_ERROR_MESSAGE":201,
    "INVALID_ACCESS_TOKEN":101,
    "ERROR_IN_EXECUTION":404,
    "IMAGE_FILE_MISSING":102,
    "INVALID_CAR_TYPE":103,
    "INVALID_BLOCK_STATUS":104,
    "INVALID_CAR_ID":105
});

App.constant("currency", {
    'currency_sign':'&#8358;'
});