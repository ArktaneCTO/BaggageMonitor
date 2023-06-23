import React, { useState, useCallback, useEffect } from "react";
import { nodes as initialNodes, edges as initialEdges } from "./elements";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import DropdownWithCheckbox from "./ReactFlowComponents/dropdown";

// import "./ReactFlow.css"

import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  Controls,
  updateEdge,
  Background,
  Position,
} from "react-flow-renderer";
import axios from "axios";
import { func } from "prop-types";

const BaggageRouteMap = ({ state }) => {
  const [dbData, setDataBaseData] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState(null);
  const [newDataLaoded, setNewDataLoaded] = useState(false);
  const [options,setOptions] = useState(null)
  const [selectedOptions,setSelectedOptions] = useState([])

  useEffect(() => {
    // main host url
    const host = "http://localhost:81";
    const url = host + `/api/airportRoutes/value/DEL`;
    const parser = require("./ReactFlowJs/GetData/parseAirportAllRoutes");
  
    axios.get(url).then((response) => {
      // parse the response data using the parseAirportAllRoutes parser function
      var parsedDate = parser.parseRouteData(response.data);
      // extract the edges and nodes from the parsed data
      const dbEdges = parsedDate.edges;
      const dbNodes = parsedDate.nodes;
      // update the state of the nodes, edges, and database data
      setNodes(dbNodes);
      setEdges(dbEdges);
      setDataBaseData(response.data);
      setNewDataLoaded(true);
      // if a ReactFlow instance is available, adjust the view to fit the new data
      if (rfInstance) rfInstance.fitView();
    });
  }, []);




  useEffect(()=>{
    if (dbData)
    {
        let routes =[];
        let terminals ={}
        dbData.forEach(route => {
            routes = [...routes,route.terminal + "-" + route.Gate]
            if(terminals[route.terminal])
                terminals[route.terminal] = [...terminals[route.terminal],route.Gate].sort()
            else
                terminals[route.terminal] = [route.Gate]
        });
        if(selectedOptions.length===0){
            console.log("setting Routes")
            setSelectedOptions(routes)
        }

        let opt=[]
  
       Object.keys(terminals).forEach(key => {
            let t = {
                label:'Terminal '+key,
                value:key,
                children:[]
                    }

            terminals[key].forEach(gate => {
                let g = {
                    label:'Gate '+gate,
                    value:key+'-'+gate,
                        }
                t.children.push(g)    
            });
            
            opt.push(t)
        });
        
        console.log("options",opt)
        setOptions(opt)
    }
  },[dbData])

  // This function will save to location of various nodes in the viewport

  function saveLayout() {
    console.log("Saving Layout");
    if (!rfInstance) {
      console.error("React Flow instance is not defined");
      return;
    }
    try {
      const nodes = rfInstance.getNodes();
      const nodePositions = {};
      nodes.forEach((node) => {
        nodePositions[node.id] = node.position;
      });
      localStorage.setItem('nodePositions', JSON.stringify(nodePositions));
    } catch (error) {
      console.error("Error saving layout:", error);
    }
  }

  //This method is loading a layout for a visualizer. It retrieves the node positions from local storage
  function loadLayout() {
    let nodePos=JSON.parse(localStorage.getItem('nodePositions'));
    console.log("Loading Layout");
    let Nodes = rfInstance.getNodes();
    Nodes.forEach(node => {
        node.position = nodePos[node.id]
    });
//    const data = JSON.parse(localStorage.getItem('myData'));
//    console.log("laoded data", data)
   setNodes(Nodes)
   setNewDataLoaded(true)

  }

  useEffect(() => {
    if (rfInstance && newDataLaoded) {
      setNewDataLoaded(false);

      // This code is used to set the initail view to fitview after the data is loaded and
      // to do this we are using a setTimeout to delay fitting by 100 ms. this we we make sure the
      // previous renders have completed
      setTimeout(() => {
        rfInstance.fitView()
      }, 100);
    }
  }, [nodes, rfInstance, newDataLaoded]);

  var FitViewOptions = {
    padding: -10,
    includeHiddenNodes: true,
    minZoom: 1,
    maxZoom: 20,
  };

  function filterRoutes(selectedOpt){
    const filteredNodes = [];

    selectedOpt.forEach((pair) => {
  const [terminal, gate] = pair.split("-");
  
  for (const key in dbData) {
    if (dbData[key].terminal === terminal && dbData[key].Gate === gate) {
        filteredNodes.push(dbData[key]);
      break;
    }
  }
});

setNodesFromRouteData(filteredNodes)

  }

  function setNodesFromRouteData(routes){
    const parser = require("./ReactFlowJs/GetData/parseAirportAllRoutes");
    var parsedDate = parser.parseRouteData(routes);
      // extract the edges and nodes from the parsed data
      const dbEdges = parsedDate.edges;
      const dbNodes = parsedDate.nodes;
      // update the state of the nodes, edges, and database data
      setNodes(dbNodes);
      setEdges(dbEdges);
      setNewDataLoaded(true)

      setTimeout(() => {
        loadLayout()
      }, 100);


  }

  const handleSelectionChange = (selectedOpt) => {
    setSelectedOptions(selectedOpt)
    filterRoutes(selectedOpt)
    // Perform any additional logic here
  };



  return (
    <>
      <div className="bg-dark w-100 h-100 d-flex align-items-center justify-content-center ">
      <DropdownWithCheckbox options={options} SelectedOptions={selectedOptions} onChange={handleSelectionChange} />
        <ReactFlow
          // sets the nodes in the react flow
          nodes={nodes}
          // this sets the edges in the react flow
          edges={edges}
          // this sets the node change updates\
          // this helps in connect the nodes with edges
          onNodesChange={onNodesChange}
          // this reflects the edge changes
          onEdgesChange={onEdgesChange}
          onInit={setRfInstance}
          fitViewOptions={FitViewOptions}
          fitView={FitViewOptions}
          connectionLineType={ConnectionLineType.SmoothStep}
          snapGrid={[10, 10]}
          snapToGrid={true}
        >
          {/* <div style={{width:"100%",backgroundColor:"rgba(0,0,255,0.2)",border:"2px solid black"}}>
                    <h2 style={{textAlign:"center",color:"floralwhite",fontFamily:"monospace"}}>Central Baggage Command</h2>
                    </div> */}
          <Background
            color={true ? "#ccc" : "#00000000"}
            variant={false ? "lines" : ""}
          />

          {/* this contains the left side controls some are already available and some are created own */}

          <Controls>
            <div className="d-flex p-0">
              <button className="w-100 m-0 p-0 border-0 bg-white" onClick={saveLayout} title="Save Layout">
                <FontAwesomeIcon icon={faSave} />
              </button>
            </div>

            <div className="d-flex p-0" >
              <button className="w-100 bg-white m-0 p-0 border-0" onClick={loadLayout} title="Open layout">
                <FontAwesomeIcon icon={faFolderOpen} />
              </button>
            </div>
          </Controls>
        </ReactFlow>
      </div>
    </>
  );
};

// returns react flow render
export default BaggageRouteMap;
