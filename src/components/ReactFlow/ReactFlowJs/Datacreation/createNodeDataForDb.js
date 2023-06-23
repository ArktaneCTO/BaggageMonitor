import { saveTemplateOfUserProcessFunc } from "../ReactFlowFunctions/actionFunctions";

const createNodesDataForDbJSON = (data, refData, terminalToUpdate) => {
    // getting the data from the database
    let dbData = refData
    // //console.log("dbData",dbData)

    let mapActivityNodes = data.nodes; // getting the nodes from the rfinstance
    let mapActivityEdges = data.edges; // getting the edges from the rfinstance

    let nodesFromDb = []; // temporary array holding db data without keys
    // //console.log(dbData)
    for (let keys in dbData.nodes) {
        nodesFromDb.push(dbData.nodes[keys]);  // push nodes From Db To TempArray
    }
    let JSONofNodesObtained = mapActivityNodes.map((node) => {
        // //console.log(node)
        let xScaleOfWindow = 150; // setting x scale
        let yScaleOfWindow = 100;  // setting y scale

        // data to set parameters initialized
        let nextNode = "";
        let nodeDbType = "";
        let nodeDbLocation = "";
        let nodeDbSubType = "";
        let Terminal = "";
        let AirportCode = "";
        let ExpectedTime = "";
        let TotTime = "";




        // finding the edge based on node id
        let edgeFound = mapActivityEdges.find(edge => edge.source === node.id)
        if (edgeFound) {
            nextNode = edgeFound.target // this edeges give the next node id to set as parameter in the framed data
        }

        // here we are finding the details of the nodes rest of the information which are required in the database  {this data is comming form the temp array of nodes formed without keys}

        let nodeDetailFoundInDb = nodesFromDb.find(nodeDb => nodeDb.nodeId === node.id)

        if (nodeDetailFoundInDb) {
            //console.log(nodeDetailFoundInDb)
            nodeDbType = nodeDetailFoundInDb.Type
            nodeDbLocation = nodeDetailFoundInDb.location
            nodeDbSubType = nodeDetailFoundInDb.SubType
            Terminal = nodeDetailFoundInDb.Terminal
            AirportCode = nodeDetailFoundInDb.AirportCode
            ExpectedTime = nodeDetailFoundInDb.ExpectedTime
            TotTime = nodeDetailFoundInDb.TotTime
        }
        // //console.log("db data is ", refData)
        let nodeJSON = { // here the node json is created
            Type: nodeDbType,
            SubType: nodeDbSubType,
            location: nodeDbLocation,
            Position: {
                AirportLocation: { x: parseFloat((node.position.x) / xScaleOfWindow), y: parseFloat((node.position.y) / yScaleOfWindow) },
                ScreenLocation: { x: parseFloat((node.position.x) / xScaleOfWindow), y: parseFloat((node.position.y) / yScaleOfWindow) }
            },
            nodeId: node.id,
            ExpectedTime: ExpectedTime,
            TotTime: TotTime,
            nextNode: nextNode,
            AirportCode: AirportCode,
            Terminal: Terminal,
            AddedAs:"Original Route"
        }
        return nodeJSON;
    })
    // localStorage.setItem("testDataNodes", JSON.stringify(JSONofNodesObtained))

    // sending the data created to the function which compiles the nodes with the rest of the information
    let finalJSON = finalNodeDataToSaveJSON(data, JSONofNodesObtained, refData, terminalToUpdate)
    return finalJSON
}


// this function returns the first node of the nodes arranged in any order
function checkIfFirstNode(nodeId, JSONofNodesObtained) {
    let nodeIdToReturn;
    // this function checks if there is any next node of the sent nodes and returns the nodes with one node which is not the next node of any node{1}
    JSONofNodesObtained.forEach((node) => {
        if (node.nextNode === nodeId) {
            nodeIdToReturn = nodeId
        }
    })
    return nodeIdToReturn;
}
// this function arranges the nodes in order
function orderedArrangementOfNodes(JSONofNodesObtained) {
    // ordered nodes array
    let orderedNodes = []
    // first node
    let theFirstNodeIs;
    JSONofNodesObtained.forEach((node) => {
        let firstNode = checkIfFirstNode(node.nodeId, JSONofNodesObtained)
        // here the recived nodes with one node with undefined is checked and first node is returned {2}
        if (!firstNode) {
            theFirstNodeIs = node
            orderedNodes.push(theFirstNodeIs);
        }
    })
    // this node find and push the next node of the first node found
    if (orderedNodes.length != 0) {
        for (let i = 0; i < JSONofNodesObtained.length; i++) {
            let nextNode = JSONofNodesObtained.find(n => n.nodeId === orderedNodes[i].nextNode)
            if (nextNode) {
                orderedNodes.push(nextNode)
            }
        }
    }

    // this returns the final ordered nodes arranged whatever the arrangement will be
    return orderedNodes
}


function finalNodeDataToSaveJSON(data, JSONofNodesObtained, refData, terminalToUpdate) {

    let orderedNodes = orderedArrangementOfNodes(JSONofNodesObtained)
    let dataForDbJSON = [];
    let nodesCreated = {};
    let JSONdata = {}

    //console.log(orderedNodes)


    // setting the key as last value after the dash in nodes 
    orderedNodes.forEach((n) => {
        let indexOfLastDashInNodeId = n.nodeId.lastIndexOf("-");
        // //console.log(indexOfLastDashInNodeId)
        var result = n.nodeId.substring(indexOfLastDashInNodeId + 1);
        nodesCreated[`${result}`] = n;

    })


    //console.log(nodesCreated)
    //console.log(refData)

    //setting the data in the JSONdata object
    JSONdata.nodes = nodesCreated


    // PUSH THE FINAL CREATED DATA TO THE 0 TH INDEX
    //console.log(JSONdata)
    dataForDbJSON[0] = JSONdata

    JSONdata.terminal = terminalToUpdate
    JSONdata.RouteInfo = refData.routeInfo;
    JSONdata.Gate = refData.routeInfo.gate

    //console.log(dataForDbJSON)

    // THIS IS FINAL DATA nodes storing in the localstorage for now
    localStorage.setItem("test", JSON.stringify(dataForDbJSON))
    return dataForDbJSON


}

export { createNodesDataForDbJSON }