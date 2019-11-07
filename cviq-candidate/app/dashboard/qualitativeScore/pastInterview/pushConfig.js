'use strict';

//TODO update certs and serverKey values
var iOSPushSettings = {
    customer: {
        iosApnCertificate: "/Certs/Distribution.pem",
        gateway: "gateway.push.apple.com"
    },
    trainer: {
        iosApnCertificate: "/Certs/DriverProduction.pem",
        gateway: "gateway.push.apple.com"
    }
};

// var androidFCMPushSettings = {
//     candidate: {
//         projectName: "CVIQ",
//         serverKey: "AIzaSyAx0M5KpeG-wcz6HnUKFmu_ghSqjBhR86o" //updated key
//     },
//     recruiter: {
//         projectName: "CVIQ",
//         serverKey: "AIzaSyBoyOy9yOplL4oSRedny-YO5Dlo114HXE0"
//     }
// };
var androidFCMPushSettings = {
    candidate: {
        projectName: "CVIQ",
        serverKey: "AIzaSyBeBk20MH3vaVfdyK5j-D-GCJIaubxbx-o" //updated key
    },
    recruiter: {
        projectName: "CVIQ",
        serverKey: "AIzaSyBeBk20MH3vaVfdyK5j-D-GCJIaubxbx-o"
    }
};

var androidSNSPushSettings = {
        projectName: "CVIQ",
        serverKey: "AIzaSyBeBk20MH3vaVfdyK5j-D-GCJIaubxbx-o", //updated key
        SNS_ARN : 'arn:aws:sns:us-east-1:219356684562:app/GCM/Cviq360'
};

module.exports = {
    iOSPushSettings: iOSPushSettings,
    androidFCMPushSettings: androidFCMPushSettings,
    androidSNSPushSettings:androidSNSPushSettings
};
