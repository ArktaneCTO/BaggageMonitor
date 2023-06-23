function parseRouteData(data) {
    console.log(data)
    let num_routes = data.length
    var nodeIds = new Array(num_routes);
    console.log("node Ids are")
    console.log(nodeIds)
    var Tnodes = [];
    var Tedges = [];
    let Anodes = data.nodes;
    console.log(Anodes)

    let count = 0;
    const xScale = 150;
    const yScale = 100;
    console.log(Anodes)
    let numNodes = Anodes.length
    console.log("hi")
    for (let key in Anodes) {
        count++;
        nodeIds[count - 1] = Anodes[key].nodeId

        let style={
            padding: 2,
            background: "#D6D5E6",
            color: "#333",
            border: "1px solid #222138",
            width: 50,
            height: 20,
        }
        let node={}
        let presetIsAvailable = JSON.parse(localStorage.getItem("PRE"));
        let viewOfVisibility=JSON.parse(localStorage.getItem('VIW'));
        if (presetIsAvailable && viewOfVisibility=='gateView') {
            console.log("hiiii")
            let visualAspectOfNode = giveVisualPropertiesFromLocal(Anodes[key].nodeId)
            console.log(visualAspectOfNode)
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
                    y: Anodes[key].Position.ScreenLocation.y * yScale,
                },
                sourcePosition: "right",
                targetPosition: "left",
                style: style,
            };
        }














        Tnodes.push(node);

    }
    for (let i = 1; i < count; i++) {
        Tedges.push({
            id: "e1-" + '-' + i.toString(),
            source: nodeIds[i - 1],
            target: nodeIds[i],
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



    return { nodes: Tnodes, edges: Tedges }

}


function giveVisualPropertiesFromLocal(nodeId) {
    console.log("inside the function node id ")
    console.log(nodeId)

    let presetIsAvailable = JSON.parse(localStorage.getItem("PRE"));
    if (presetIsAvailable) {
        console.log("available preset is ", presetIsAvailable)
        let nodesOfPreset = presetIsAvailable.nodes;
        for (let keys in nodesOfPreset) {
            if (nodesOfPreset[keys].id == nodeId) {
                return nodesOfPreset[keys]  // push nodes From Db To TempArray
            }
        }
    }

}



export { parseRouteData }