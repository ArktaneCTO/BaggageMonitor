function parseAndSetNodesAndEdges(items) { // to parse test data not use
    let xScale = 150;
    let yScale = 100;
    console.log("local storage item data ", items)
    let nodeArray = [];
    let edgeArray = [];
    let count = 0;
    items.forEach(element => {
        let node = {
            id: element.nodeId,
            data: {
                label: element.SubType,
            },
            position: {
                x: element.Position.ScreenLocation.x * xScale,
                y: element.Position.ScreenLocation.y * yScale,
            },
            sourcePosition: "right",
            targetPosition: "left",
            style: {
                padding: 2,
                background: "#D6D5E6",
                color: "#333",
                border: "1px solid #222138",
                width: 50,
                height: 20,
            },
        };
        let edge = {
            id: "e1-" + count.toString() + '-' + (count + 1).toString(),
            source: element.nodeId,
            target: element.nextNode,
            type: "smoothstep",
            animated: true,
            arrowHeadType: "dashed",
            style: {
                strokeWidth: 10,
                stroke: "lightgreen",
                strokedDasharray: 5,
            },
        }
        count++;
        nodeArray.push(node);
        edgeArray.push(edge)
    });
    // set nodes and edges in screen after taking from the local storage

    return {nodes:nodeArray,edges:edgeArray}
    
}

export{parseAndSetNodesAndEdges}