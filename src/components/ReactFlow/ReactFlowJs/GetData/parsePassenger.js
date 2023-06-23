import axios from "axios";
import icon from './icon.tsx'
import {getBezierPath} from 'react-flow-renderer'

async function parseRouteData(Tnodes,Tedges,data) {
    //console.log(Tnodes,"Tnodes")
    var notPresent = false;
    var reachedNodeIds = [];
    var NodeIds = [];
    var NodePositions = {};
    var NodeTimeReached = {};
    var journyComplete = false
    var endNodeId = "";

    console.log("allnodes",data)
    if(data){
  let nodesfromDB = data.nodes
      //console.log(response.data[0].GUID,response.data[0].nodes)
      
      for(let key in nodesfromDB){
    NodeIds.push(nodesfromDB[key].nodeId)
      }
    for(let key in nodesfromDB){
        notPresent=!(nodesfromDB[key].TimeWhenbagReachedHere>0)
        
        ////console.log("node",nodeId)
        if(notPresent)
     {       break}
     else
     {if(nodesfromDB[key].SubType==="END"){
      journyComplete = true;
      endNodeId = nodesfromDB[key].nodeId
     }}
        
    reachedNodeIds.push(nodesfromDB[key].nodeId)
NodeTimeReached[nodesfromDB[key].nodeId] = [nodesfromDB[key].TimeWhenbagReachedHere,nodesfromDB[key].ExpectedTime,nodesfromDB[key].TotTime]
      }


//console.log("inside the parse function");
var nodes = goclone(Tnodes);
for(let key in nodes){
  
  NodePositions[nodes[key].id] = nodes[key].position
    if(reachedNodeIds.includes(nodes[key].id))
    {nodes[key].style["background"] = "green"
     nodes[key].style["color"] = "Black"
    }
     else{
        
    nodes[key].style["background"] = "#D6D5E6"
    nodes[key].style["color"] = "#333"
     }
};




//console.log("after parse",NodePositions)
var activeEdge ={}
var edges = goclone(Tedges);
edges.forEach(element => {
    if(reachedNodeIds.includes(element.source)&&reachedNodeIds.includes(element.target))
    element.style["stroke"] = "lightgreen"
    else if(NodeIds.includes(element.source)&&NodeIds.includes(element.target))
    {
      if(reachedNodeIds.includes(element.source)&&(!reachedNodeIds.includes(element.target))){
        activeEdge["source"] = NodePositions[element.source]
        activeEdge["sink"] = NodePositions[element.target]
        activeEdge["edgeId"] = element["id"]
        activeEdge["timeReached"] = NodeTimeReached[element.source]
    //console.log(element)
      }
    element.style["stroke"] = "yellow"
    }
    else
    {
      
    element.style["stroke"] = "gray"
  }
});

console.log("element",activeEdge)
let offsetRatio = 0.4
var bagNodeOffset ={}
let bagColor = "green"
if(journyComplete){
  bagNodeOffset = {
    x:NodePositions[endNodeId].x,
    y:NodePositions[endNodeId].y-25,
  }
}
else{
let timeElapsedInMinutes =(Date.now()-activeEdge.timeReached[0])/60000

if (timeElapsedInMinutes>activeEdge.timeReached[2])
{
  offsetRatio = 0.49
  bagColor = "red"
}
else if(timeElapsedInMinutes>activeEdge.timeReached[1])
{
  offsetRatio = 0.49
  bagColor = "orange"
}
else{
  offsetRatio = timeElapsedInMinutes/activeEdge.timeReached[1]
}
 bagNodeOffset = {
  x:activeEdge.source.x+Math.abs(activeEdge.source.x-activeEdge.sink.x)*offsetRatio+8,
  y:(offsetRatio<0.5?activeEdge.source.y:activeEdge.sink.y)-25
}
}



//console.log("bagnodeOffset",activeEdge,Date.now(),activeEdge.timeReached[0],(activeEdge,Date.now()-activeEdge.timeReached[0])/60000)
let bagNode =  {
  id: "1",
  type: "input",
  data: {
    
    label: <svg fill={bagColor} height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 220.168 220.168"  >
 <path d="M31.622,100.402v-0.624c0-4.143,3.358-7.5,7.5-7.5h37.725c4.142,0,7.5,3.357,7.5,7.5v0.624h51.476v-0.624
   c0-4.143,3.358-7.5,7.5-7.5h37.725c4.142,0,7.5,3.357,7.5,7.5v0.624h31.622V79.259c0-14.337-11.664-26-26-26h-36.171V29.495
   c0-4.143-3.358-7.5-7.5-7.5H69.671c-4.142,0-7.5,3.357-7.5,7.5v23.765H26c-14.336,0-26,11.663-26,26v21.143H31.622z M77.171,36.995
   h65.825v16.265H77.171V36.995z M220.168,115.402v56.771c0,14.337-11.664,26-26,26H26c-14.336,0-26-11.663-26-26v-56.771h31.622
   v3.896c0,4.143,3.358,7.5,7.5,7.5h37.725c4.142,0,7.5-3.357,7.5-7.5v-3.896h51.476v3.896c0,4.143,3.358,7.5,7.5,7.5h37.725
   c4.142,0,7.5-3.357,7.5-7.5v-3.896H220.168z"/>
 </svg>
                   
  },
  draggable: false,
  selectable: false,
  connectable: false,
  style: {
    height : 27,
    width : 30,
    padding: 3,
    margin: 0,
    color:"red",
    background:"#ffffff99",
    nodeStrokeColor:"red",
    border:"transparent"
  },
  position: {x: bagNodeOffset.x,y:bagNodeOffset.y},
}
nodes.push(bagNode)
//console.log("nodes",nodes)


  return { nodes: nodes, edges: edges };
}
else{
  
  return { nodes: Tnodes, edges: Tedges };
}
}



function goclone(source) {
    if (Object.prototype.toString.call(source) === '[object Array]') {
        var clone = [];
        for (var i = 0; i < source.length; i++) {
            clone[i] = goclone(source[i]);
        }
        return clone;
    } else if (typeof (source) == "object") {
        var clone = {};
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                clone[prop] = goclone(source[prop]);
            }
        }
        return clone;
    } else {
        return source;
    }
}

export { parseRouteData };
