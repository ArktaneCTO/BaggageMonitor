function parseRouteData(data) {
    
    let num_routes = data.length
    
    var nodeIds = new Array(num_routes);
    ////console.log("node Ids are")
    ////console.log(nodeIds)
    var routeInfo = []
    var Tnodes = [];
    var Tedges = [];
    for (let ii = 0; ii < num_routes; ii++) {
        
        // here if we are unable to get the terminal then we will show the gate only
        if(!data[ii].terminal){
            // this is for the terminal view
            routeInfo[ii]="Gate "+data[ii].routeInfo.gate
        }else{
            // this is for the airport view
            routeInfo[ii]=data[ii].terminal + ", " + data[ii].Gate
        }
        //console.log(routeInfo)
        let mode = "RM";
        if (mode === "RM") {
            let Anodes = data[ii].nodes;
            ////console.log(Anodes)

            let count = 0;
            const xScale = 150;
            const yScale = 100;
            //////console.log(Anodes)
            let numNodes = Anodes.length
            ////console.log("hi")
            nodeIds[ii] = new Array((numNodes));
            for (let key in Anodes) {
                count++;
                let nodeExist = exists(nodeIds, Anodes[key].nodeId)
                nodeIds[ii][count - 1] = Anodes[key].nodeId
                if (!nodeExist) {
                    let node = {};
                    let style={
                                padding: 2,
                                background: "#D6D5E6",
                                color: "#333",
                                border: "1px solid #222138",
                                width: 50,
                                height: 20,
                            }


                    let presetIsAvailable = JSON.parse(localStorage.getItem("PRE"));
                    let viewOfVisibility=JSON.parse(localStorage.getItem('VIW'));
                    ////console.log( viewOfVisibility)
                    if (presetIsAvailable && viewOfVisibility=='airportView') {
                        //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$")
                        let visualAspectOfNode = giveVisualPropertiesFromLocal(Anodes[key].nodeId)
                        //console.log(visualAspectOfNode)
                        node = {
                            id: Anodes[key].nodeId,
                            data: {
                                label: Anodes[key].SubType,
                            },
                            position: {
                                x: visualAspectOfNode ? visualAspectOfNode.position.x-200:Anodes[key].Position.ScreenLocation.x * xScale-200,
                                y: visualAspectOfNode?visualAspectOfNode.position.y-200:Anodes[key].Position.ScreenLocation.y * yScale-200,
                            },
                            sourcePosition: "right",
                            targetPosition: "left",
                            style: visualAspectOfNode?visualAspectOfNode.style:style,
                        };
                    } else {
                        node = {
                            id: Anodes[key].nodeId,
                            data: {
                                label: Anodes[key].SubType,
                            },
                            position: {
                                x: Anodes[key].Position.ScreenLocation.x * xScale-200,
                                y: Anodes[key].Position.ScreenLocation.y * yScale-200,
                            },
                            sourcePosition: "right",
                            targetPosition: "left",
                            style: style,
                        };
                    }
                    Tnodes.push(node);
                }
            }
            ////console.log("nodeIds", count, nodeIds[ii].length)
            for (let i = 1; i < count; i++) {
                Tedges.push({
                    id: "e1-" + nodeIds[ii][i - 1] + '-' + nodeIds[ii][i],
                
                    label:i===1?routeInfo[ii]:"",
                    labelShowBg : false,
                    labelStyle:{
                        transform:'translate(-20px, -15px)',
                        fill:'white',
                    },
                    source: nodeIds[ii][i - 1],
                    target: nodeIds[ii][i],
                    type: "smoothstep",
                    animated: true,
                    arrowHeadType: "dashed",
                    style: {
                        strokeWidth: 10,
                        stroke: "lightgreen",
                        strokeDasharray: 5,
                    },
                });
            }
        }
        ////console.log(ii, Tnodes)
    }

    return { nodes: Tnodes, edges: Tedges }

}

function exists(arr, search) {
    return arr.some(row => row.includes(search));
}

function giveVisualPropertiesFromLocal(nodeId) {
    // //console.log("inside the function node id ")
    ////console.log(nodeId)

    let presetIsAvailable = JSON.parse(localStorage.getItem("PRE"));
    if (presetIsAvailable) {
        ////console.log("available preset is ", presetIsAvailable)
        let nodesOfPreset = presetIsAvailable.nodes;
        for (let keys in nodesOfPreset) {
            if (nodesOfPreset[keys].id == nodeId) {
                return nodesOfPreset[keys]  // push nodes From Db To TempArray
            }
        }
    }

}


export { parseRouteData }

