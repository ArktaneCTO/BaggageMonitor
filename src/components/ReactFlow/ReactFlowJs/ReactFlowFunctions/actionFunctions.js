import axios from "axios";


// this function is the process of the save template to save the template created by the person
function saveTemplateOfUserProcessFunc(rfInstance, view) {
    console.log("called me")
    // token decryption
    let sendToken = require("../TokenDecrypt")
    let bearerToken = sendToken.sendToken

    // data creation here to save in the screen variable of the person in the database
    const palletData = rfInstance.toObject();
    console.log(palletData)
    let nodeDataToSave = {};
    // this collects the visual aspects of the nodes from the rfinstance
    palletData.nodes.forEach(n => {
        nodeDataToSave[`${n.id}`] = n;

    });

    console.log(view)

    console.log(nodeDataToSave)

    // here the template name is fetched for the template to create
    let templateNameElement = document.getElementById("TemplateName")
    let templateNameOfUser = templateNameElement.value
    if (templateNameOfUser) {
        // let userTemplateData = {}
        let userTemplateData = {
            templateName: templateNameOfUser,
            view: view,
            nodes: nodeDataToSave,

        }

        let hostUrlFetch = require("./UrlBasedOnAction");
        // based on the role the api is served and the template is saved in the person database
        let URL = hostUrlFetch.determineUrlBasedOnRole()
        try {
            axios.post(URL.savedTemplateUrlPost, {
                screen: userTemplateData
            }, {
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                },
            }).then((response) => {
                alert("template created")
            })
        } catch (error) {
            console.log(error)
        }
    }


}


// THIS IS A MAIN FUNCTION WHICH SAVES THE DATA CREATED TO THE DATABASE
function updateNodesEditedToDatabaseProcessFunc(data, databaseData, terminal) {
    let createDbJsonData = require("../Datacreation/createNodeDataForDb");
    // this nodeJSON returns the ordered data and proper arrangement of nodes no matter what the arrangements are
    let nodeJSON = createDbJsonData.createNodesDataForDbJSON(data, databaseData, terminal);
    console.log('#########################################')
    console.log(nodeJSON);
    // this stores the final nodes
    let finalNodesOrderCheck = []
    console.log("final check node order");
    console.log(nodeJSON[0].nodes)
    for (let key in nodeJSON[0].nodes) {
        finalNodesOrderCheck.push(nodeJSON[0].nodes[key].SubType);  // push nodes From Db To TempArray
    }
    console.log(finalNodesOrderCheck)
    // for now save in the local storage any changes
    // first the data to update is stored in the finalDBR then it is passed on to save in the database
    localStorage.setItem("finalDBR", JSON.stringify(nodeJSON))

    let finalNodesToSave = JSON.parse(localStorage.getItem('finalDBR'));
    console.log(finalNodesToSave)
    let terminalToUpdate = finalNodesToSave[0].terminal;
    let airportcode = localStorage.getItem('Info');
    let gate = finalNodesToSave[0].Gate;


    // here if the data is prepared then it is sent to update in the database
    if (nodeJSON) {
        // token decryption
        let sendToken = require("../TokenDecrypt")
        let bearerToken = sendToken.sendToken
        console.log("hi")
        axios.post(`http://localhost:81/api/updateRoute/airportcode/${airportcode}/Gate/${gate}`, {
            terminal: terminalToUpdate,
            nodeJSON: nodeJSON
        }, {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        }).then((response) => {
            if(response.data.success===false){
                alert(response.data.message);
            }else{
                alert(response.data.message)
                window.location.reload()
            }
        })

    }

}


// set the database data in the local storage
function setDatabaseDataInLocalStorage(data) {
    if (data) {
        console.log("data to set in local storage")
        let dataToStore = JSON.stringify(data)
        localStorage.setItem("DBR", dataToStore)
    }
}


export { saveTemplateOfUserProcessFunc, updateNodesEditedToDatabaseProcessFunc, setDatabaseDataInLocalStorage }