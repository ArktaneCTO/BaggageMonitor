
// this function act as a directory and serves the api based on the role of the user
function determineUrlBasedOnRole() {
    let objectAirportAdmin = {
        savedTemplateUrlGet: "http://localhost:80/api/airportAdmin/actions/showAllSavedTemplates",
        savedTemplateUrlPost: "http://localhost/api/airportAdmin/actions/saveMapTemplate"
    }
    let objectUser = {
        savedTemplateUrlGet: "",
        savedTemplateUrlPost: ""
    }

    let fetchRoleOfPerson = require("../TokenDecrypt");
    let roleOfPerson = fetchRoleOfPerson.sendRole;

    let urlsToPass={};
    if (roleOfPerson === "AirportAdmin") {
        urlsToPass= objectAirportAdmin
    } else if (roleOfPerson === "User") {
        urlsToPass= objectUser
    }

    // this returns the api url based on the role
    return urlsToPass
}

export { determineUrlBasedOnRole };