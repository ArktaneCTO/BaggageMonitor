import React, { useState, useCallback, useEffect } from "react";
// import "./ReactFlow.css"

import ReactFlow, {
    addEdge,
    useNodesState,
    useEdgesState,
    ConnectionLineType,
    Controls,
    updateEdge,
    Background,
} from "react-flow-renderer";
import axios from "axios";
import { nodes as initialNodes, edges as initialEdges } from "./elements";
import { BorderlessTableOutlined } from "@ant-design/icons";
import RightControls from "./ReactFlowComponents/ControlComponents/RightControls";
import BottomControl from "./ReactFlowComponents/ControlComponents/EditBottomControl";
import LeftControls from "./ReactFlowComponents/ControlComponents/LeftControls";
import ShowPnrControls from "./ReactFlowComponents/ControlComponents/ShowPnrControl";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:81";
var dbEdges = [];
var dbNodes = [];

const ReactFlowRenderer = ({ state }) => {
    console.log("state at reactFLow:", state);
    var airportcode, terminal, gate, view;
    // here the state is set for the information and the view which is being displayed
    if (state) {
        airportcode = state.airportcode;
        terminal = state.terminal;
        gate = state.gate;
        view = state.view;
    } else {
        view = "airportView";
        airportcode = localStorage.getItem("Info");
        ////console.log("ajsd", airportcode);
    }
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [defnodes, setdefNodes] = useNodesState(initialNodes);
    const [defedges, setdefEdges] = useEdgesState(initialEdges);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [mapEditable, setMapEditable] = useState(false);
    const [showPnr, setShowPnrControls] = useState(false);
    // rfinstance sets the state of the pallet
    const [rfInstance, setRfInstance] = useState(null);
    const [templateFetchedData, setTemplatesFetchecData] = useState([]);
    const [gridOn, setGrid] = useState(false);
    const [showByPNR, setShowByPNR] = useState(false);
    const [snapOn, setGridSnap] = useState(false);
    const [databaseData, setDataBaseData] = useState(null);
    
    // this is to set the input value of the pnr of textbox
    const [pnrNumberInputFetched, setPnrNumberInput] = useState("");
    const [showAllGuids, setGuids] = useState([]);
    const [selectedGuid, setSelectedGUID] = useState();
    const [validPnr, setValidPNR] = useState(false);

    const [SocketResponse, setSocketResponse] = useState("");

    useEffect(() => {
      const socket = socketIOClient(ENDPOINT);
      socket.on("FromAPI", data => {
        console.log("Response socket before check",data,selectedGuid,data.guid==selectedGuid)
        if(data.guid === selectedGuid)
           { setSocketResponse(data);
        console.log("Response socket",data,selectedGuid)}
      });
    }, [selectedGuid]);

    // this returns the role of the person who has logged in
    let roleOfPerson = require("./ReactFlowJs/TokenDecrypt");

    // these functions are by default functions of config of react flow
    const onConnect = useCallback(
        (params) =>
            setEdges((eds) =>
                addEdge(
                    {
                        ...params,
                        type: ConnectionLineType.SmoothStep,
                        // animated: true,
                        style: { stroke: "red" },
                    },
                    eds
                )
            ),
        [setEdges]
    );

    //This function generates a uuid to set the node id
    const getNodeId = () => {
        var dt = new Date().getTime();
        var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
                var r = (dt + Math.random() * 16) % 16 | 0;
                dt = Math.floor(dt / 16);
                return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
            }
        );
        return uuid;
    };
    // this display the custom modal created
    function displayCustomNamedNodeModal() {
        setIsModalVisible(true);
    }
    // this function handels all the cancel buttons
    function handleCancel() {
        setIsModalVisible(false);
    }
    // this function adds a new node to the screen pallet
    function addNode(e) {
        e.preventDefault();
        ////console.log(e.target);
        // fetching all the details of the inputs
        let type = e.target.type.value;
        let subType = e.target.subType.value;
        let location = e.target.location.value;
        let ExpectedTime = e.target.ExpectedTime.value;
        let TotTime = e.target.TotTime.value
        let allNodesArray = [];
        let localStorageData = JSON.parse(localStorage.getItem("DBR"));
        ////console.log(localStorageData);
        allNodesArray = localStorageData.nodes;
        ////console.log(allNodesArray);

        // find the new node in rfInstance
        let newNodeAdded = onAdd(subType);
        // this gives the last part of the node id to set as key
        const nodeIdLast = newNodeAdded.id.split("-")[4];
        ////console.log(newNodeAdded);
        // this is the JSON structure of data in which format the data is to be set in the new node
        let finalJsonData = {
            Type: type,
            SubType: subType,
            AirportCode: airportcode,
            Terminal: terminal,
            location: location,
            nodeId: newNodeAdded.id,
            Position: {
                AirportLocation: {
                    x: newNodeAdded.position.x,
                    y: newNodeAdded.position.y,
                },
                ScreenLocation: {
                    x: newNodeAdded.position.x,
                    y: newNodeAdded.position.y,
                },
            },
            ExpectedTime: ExpectedTime,
            TotTime: TotTime
        };

        ////console.log(allNodesArray);
        allNodesArray[nodeIdLast] = finalJsonData;
        localStorageData.nodes = allNodesArray;

        ////console.log(localStorageData);
        let dataToStore = JSON.stringify(localStorageData);
        //after the node is created it is updated in the {DBR} in local storage where rest operation happen
        localStorage.setItem("DBR", dataToStore);

        //   localStorage.setItem("DBR",localStorage)

        // this function close the modal after the submit
        setIsModalVisible(false);
    }

    // this adds a new node in the map pallet
    const onAdd = useCallback(
        (data) => {
            const newNode = {
                style: {
                    padding: 2,
                    background: "#D6D5E6",
                    color: "#333",
                    border: "1px solid #222138",
                    width: 50,
                    height: 20,
                },
                sourcePosition: "right",
                targetPosition: "left",
                id: String(getNodeId()),
                data: { label: data },
                position: {
                    x: 50,
                    y: 0,
                },
            };

            setNodes((nds) => nds.concat(newNode));
            return newNode;
        },
        [setNodes]
    );
    // these functions are by default functions of config of react flow end

    // these functions makes the edges to delete and create new and update
    // for edge update for removing and adding new edge
    const onEdgeUpdateStart = useCallback(() => {
        edges.current = false;
    }, []);
    // this updates the edges after changes
    const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
        edges.current = true;

        setEdges((els) => updateEdge(oldEdge, newConnection, els));
    }, []);
    // this stops the edge update
    const onEdgeUpdateEnd = useCallback((_, edge) => {
        if (!edges.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }
        edges.current = true;
    }, []);
    // these functions makes the edges to delete and create new and update end

    // this fetches the saved template data
    const fetchDetails = async () => {
        let sendToken = require("./ReactFlowJs/TokenDecrypt.js");
        // this gives the bearer token to set to get the data
        let bearerToken = sendToken.sendToken;
        let hostUrlFetch = require("./ReactFlowJs/ReactFlowFunctions/UrlBasedOnAction");
        // this function selects the url based on the role of the user so as to give the data based on the role
        let URL = hostUrlFetch.determineUrlBasedOnRole();
        // ////console.log()
        // alert()
        try {
            const response = await axios.get(URL.savedTemplateUrlGet, {
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                },
            });
            // this sets the data fetched form the database in the dropdown
            setTemplatesFetchecData(response.data.templatesArray);
        } catch (error) {
            console.error(error);
        }
    };
    // this shows the data or the airport based on the template view selected only the visual aspects and the data is fetched from the database
    const showTemplateView = (e) => {
        // this gives the name of the preset selected so as to filter out and show the value
        let theView = e.target.getAttribute("value");
        ////console.log(templateFetchedData);
        ////console.log(templateFetchedData)
        // this filters the data based on the name of the preset selected and sets in the database
        const templateDataFound = templateFetchedData.find(
            (template) => template.templateName === theView
        );
        ////console.log(templateDataFound)
        // if the template is found then only save the preset information
        if (templateDataFound) {
            // if the template data is found then set the present in the localstorage
            // this sets the preset data
            localStorage.setItem("PRE", JSON.stringify(templateDataFound));
            // this sets the view data
            localStorage.setItem("VIW", JSON.stringify(view));
        }

        // refresh the screen after the template is set to load the changes
        window.location.reload()
    };
    // this function saves the template created 
    const saveTemplateOfUser = useCallback(async () => {
        if (rfInstance && view) {
            let saveTeplateOfUserProcess = require("./ReactFlowJs/ReactFlowFunctions/actionFunctions");
            // this takes the two values rfInstance and the view to save the template based on the view
            saveTeplateOfUserProcess.saveTemplateOfUserProcessFunc(rfInstance, view);
        }
    }, [rfInstance]);

    // this function tells the details of the selected node
    const getDetailsOfNode = (e) => {
        // this line returns the nodeid of the node clicked on the screen
        let IdOfTheSelectedNode = e.target.getAttribute("data-id");
        ////console.log(IdOfTheSelectedNode)
        // this will fetch the main database data form the localstorage
        let nodesDataOfDbInLocalStorage = JSON.parse(localStorage.getItem("DBR"))
        ////console.log(nodesDataOfDbInLocalStorage)
        // now based on the view the data is mapped and show in the alert box
        if (view == 'airportView') {
            nodesDataOfDbInLocalStorage.forEach(terminals => {
                // match the node id of the selected node and data fetched from the database
                for (let keys in terminals.nodes) {
                    let nodeIdOfnodesOfDbLocal = terminals.nodes[keys].nodeId
                    if (nodeIdOfnodesOfDbLocal == IdOfTheSelectedNode) {
                        let dataOfNode = terminals.nodes[keys]
                        let tellJSONdata = {
                            ExpectedTime: dataOfNode.ExpectedTime,
                            SubType: dataOfNode.SubType,
                            location: dataOfNode.location,
                            TotTime: dataOfNode.TotTime
                        }
                        // alert(`${JSON.stringify(tellJSONdata)}`)
                        // this is the alert portion where the data is shown for the airport view
                        alert(`
SubType= ${tellJSONdata.SubType}
ExpectedTime= ${tellJSONdata.ExpectedTime}
Location= ${tellJSONdata.location}
TotTime= ${tellJSONdata.TotTime}
                                `)
                    }
                }
            });
        } else if (view == 'gateView') {
            // match the node id of the selected node and data fetched from the database
            for (let keys in nodesDataOfDbInLocalStorage.nodes) {
                if (nodesDataOfDbInLocalStorage.nodes[keys].nodeId == IdOfTheSelectedNode) {
                    let dataOfNode = nodesDataOfDbInLocalStorage.nodes[keys]
                    ////console.log(dataOfNode)
                    let tellJSONdata = {
                        Terminal: dataOfNode.Terminal,
                        SubType: dataOfNode.SubType,
                        location: dataOfNode.location,
                    }


                    // this is the alert portion where the data is shown for the gate view
                    alert(`
Terminal= ${tellJSONdata.Terminal}
SubType= ${tellJSONdata.SubType}
Location= ${tellJSONdata.location}
                            `)
                }
            }
        } else if (view === "pnrView") {
        } else {
            ////console.log("not data to show")
        }
    };

    // THIS IS THE MAIN FUNCTION WHICH MAKES THE DATA BASED ON EDITING DONE IN THE SCREEN PALLET
    const createDataForDbJSON = async () => {
        // this map activity fetch the edited data on the react flow and sets in the mapActivityData for rfInstance
        let mapActivityData = rfInstance.toObject();
        if (view == 'gateView') {
            // if the gateView is the view then only allow to save the edited data
            let saveToDataBaseNodesJSON = require("./ReactFlowJs/ReactFlowFunctions/actionFunctions");
            // getting saved data form database form localstorage
            let dataToArrange = JSON.parse(localStorage.getItem("DBR"));
            // this function arranges the nodes and saves final in database and updates the database
            saveToDataBaseNodesJSON.updateNodesEditedToDatabaseProcessFunc(
                mapActivityData,
                dataToArrange,
                terminal
            );
        }
    };

    // this function toggles between the Show path button to show the controls
    const setShowPnrControlsFunc = () => {
        // toggels between the show pnr controls  and not show pnr controls
        setShowPnrControls((current) => !current);
    };
    // this function sets the map to editable mode and display the bottom controls
    const setMapEditableFunc = () => {
        // toggels between the editable and not editable
        setMapEditable((current) => !current);
    };
    // this function allow to show the edit button if gate view
    const setVisibilityOfEdit = () => {
        let allowOrNot = false
        // if gate view is selected then edit is allowed
        if (view == 'gateView') {
            allowOrNot = true
        }
        return allowOrNot
    }

    useEffect(() => {
      async function FetchedData() {
        if (showByPNR) {
          //////console.log("inside showByPNR")
          // this function will fetch the data based on the pnr number
          console.log("selected GUID", selectedGuid);

          let selectedGUidRoute =   showAllGuids.filter((element)=>{
                return element.GUID === selectedGuid
            })
            
console.log("selectedGUidRoute", selectedGUidRoute);
            let PaxParser = require("./ReactFlowJs/GetData/parsePassenger");
  var parsedDate = await PaxParser.parseRouteData(nodes, edges,selectedGUidRoute[0]);
          dbEdges = parsedDate.edges;
          dbNodes = parsedDate.nodes;
            console.log("updating pass route")
          ////console.log("Nodes in react",dbNodes)
          setNodes(dbNodes);
          setEdges(dbEdges);
        }
      }
      if(validPnr)
        FetchedData();
    }, [selectedGuid,showAllGuids]);
    // this parse th,showe data which is fetched form the database
    useEffect(() => {
        // main host url
        const host = "http://localhost:81";
        ////console.log("inside get data")
        var url = "";
        var parser;
        // sets the parser based on the view selected
        switch (view) {
            case "airportView":
                ////console.log("in airportView");
                url = host + `/api/airportRoutes/value/${airportcode}`;
                parser = require("./ReactFlowJs/GetData/parseAirportAllRoutes");
                break;
            case "gateView":
                ////console.log("in gateView");
                url = host + `/api/airportRoutes/airportcode/${airportcode}/terminal/${terminal}/gate/${gate}`;
                parser = require("./ReactFlowJs/GetData/parseAirportGate");
                break;
            case "terminalView":
                ////console.log("in terminal view")
                url = host + `/api/airportRoutes/airportcode/${airportcode}/terminal/${terminal}`
                parser = require("./ReactFlowJs/GetData/parseAirportAllRoutes");
                break;
            default:
                ////console.log("in defaultView");
                url = host + `/api/airportRoutes/value/${airportcode}`;
                parser = require("./ReactFlowJs/GetData/parseAirportAllRoutes");
                break;
        }
        // this fetches the data and puts the data form the database and pass it in the parser based on the view
        axios.get(url).then((response) => {
            var parsedDate = parser.parseRouteData(response.data);
            dbEdges = parsedDate.edges;
            dbNodes = parsedDate.nodes;
            ////console.log("From database");
            ////console.log(response.data);
            setNodes(dbNodes);
            setEdges(dbEdges);
            setDataBaseData(response.data);

            // set the data in localstorage
            let setDataInLocalStorage = require("./ReactFlowJs/ReactFlowFunctions/actionFunctions");
            // this sets the data parsed in the local storage {DBR}
            setDataInLocalStorage.setDatabaseDataInLocalStorage(response.data);
        });
        // }
    }, [view, airportcode, terminal, gate, setNodes, setEdges]);

    // this will fetch the guid data of the pnr based on the pnr entered
   
    // this is use to fetch the data of the input guid
    useEffect(() => {
        async function fetchData(){
        // this will fetch the pnr details based on the pnr entered
        console.log("the recived pnr number is ", pnrNumberInputFetched)

       // let url = `http://localhost:81/api/passengerRoute/pnr/ec1fse`

         let url = `http://localhost:81/api/passengerRoute/pnr/${pnrNumberInputFetched}`
         try{
        let response =await axios.get(url)
            console.log("Valid Pnr",Array.isArray(response.data),response.data, validPnr)
            let valid = Array.isArray(response.data)&&(response.data.length)
            // if(!valid)
            //     alert("Invalid Pnr")
            setValidPNR(valid)
            //console.log("allnodes", response.data.length, validPnr)
            setGuids(response.data)
         }
         catch(error){
            console.log("get Pnr Error",error)
            setValidPNR(false)
         }
        }
        

        if(showByPNR)
            fetchData()    

    }, [pnrNumberInputFetched, validPnr,SocketResponse,showByPNR])
    // this is use to fetch the guid selected


    // this fetches the details of the template data
    useEffect(() => {
        // this fetches the details of the presets made 
        fetchDetails();
    }, [state]);

    useEffect(()=>{
        console.log("ShowPnr",showPnr)
        if(showByPNR)
        {  
          setdefNodes(nodes)
          setdefEdges(edges)
          setPnrNumberInput("")
          setGuids("")
          setSelectedGUID("")

          
      }
      else
      {  
        setNodes(defnodes)
        setEdges(defedges)
    }
    },[showPnr])
    // use effects end
    var FitViewOptions = {
        padding: -10,
        includeHiddenNodes: true,
        minZoom: 1,
        maxZoom: 20
    };

    // useEffect(()=>{
    //     // this function removes the react flow icon at the bottom right corner
    //     let reactFlowLabel=document.getElementsByClassName("react-flow__attribution bottom right")[1];
    //     reactFlowLabel.style.display="none"
    //     //console.log(reactFlowLabel)
    // })
    return (
        <>
            <div className="bg-dark" style={{ width: "100%", height: "70vh" }} id="reactFlowDiv">
                {/* this adds the add node modal */}
                <div id="modalOfAddNode">
                    {isModalVisible && (
                        <form
                            style={{ backgroundColor: "white", zIndex: "5", height: "80%" }}

                            onSubmit={addNode}
                            onCancel={handleCancel}
                        >
                            <h4 class="text-white text-center  bg-primary rounded">
                                Add Nodes
                            </h4>

                            <label>Type</label>
                            <input type="text" class="form-control" name="type" />
                            <label>subType</label>
                            <input type="text" class="form-control" name="subType" />
                            <label>Location</label>
                            <input type="text" class="form-control" name="location" />
                            <label>Expected Time</label>
                            <input type="text" class="form-control" name="ExpectedTime" />
                            <label>Tot Time</label>
                            <input type="text" class="form-control" name="TotTime" />

                            <div class="container">
                                <div class="row" style={{ color: "white", padding: "5%" }}>
                                    <div class="col-md-6 text-left">
                                        <button type="submit" class="btn btn-primary">
                                            Submit
                                        </button>
                                    </div>

                                    <div class="col-md-6 text-right">
                                        <button
                                            type="button"
                                            class="btn btn-primary float-left"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
                <ReactFlow
                    // sets the nodes in the react flow
                    nodes={nodes}
                    // this sets the edges in the react flow
                    edges={edges}
                    // this sets the node change updates
                    onNodesChange={onNodesChange}
                    // this reflects the edge changes
                    onEdgesChange={onEdgesChange}
                    // this helps in connect the nodes with edges
                    onConnect={onConnect}
                    // this initializes and sets  the rfinstace data which shows the pallet activity
                    onInit={setRfInstance}
                    // this updates the edge on delete
                    onEdgeUpdate={
                        roleOfPerson.sendRole === "AirportAdmin" && view == 'gateView'
                            ? onEdgeUpdate : () => { }
                    }
                    // this starts the edge update
                    onEdgeUpdateStart={
                        roleOfPerson.sendRole === "AirportAdmin" && view == 'gateView'
                            ? onEdgeUpdateStart
                            : () => { }
                    }
                    // this stops the edge delete and update
                    onEdgeUpdateEnd={
                        roleOfPerson.sendRole === "AirportAdmin" && view == 'gateView'
                            ? onEdgeUpdateEnd
                            : () => { }
                    }
                    fitViewOptions={FitViewOptions}
                    fitView={FitViewOptions}

                    connectionLineType={ConnectionLineType.SmoothStep}
                    // to get details on node click
                    onNodeClick={getDetailsOfNode}
                    snapGrid={[10, 10]}
                    snapToGrid={snapOn}
                >
                    {/* <div style={{width:"100%",backgroundColor:"rgba(0,0,255,0.2)",border:"2px solid black"}}>
                    <h2 style={{textAlign:"center",color:"floralwhite",fontFamily:"monospace"}}>Central Baggage Command</h2>
                    </div> */}
                    <Background
                        color={gridOn ? "#ccc" : "#00000000"}
                        variant={gridOn ? "lines" : ""}
                    />

                    {/* this contains the left side controls some are already available and some are created own */}
                    <Controls>
                        {/* this is to save the user template */}
                        <LeftControls saveTemplateOfUser={saveTemplateOfUser} />
                    </Controls>
                    {/* this has all the right controls */}
                    <RightControls
                        // this shows the custom modal
                        displayCustomNamedNodeModal={displayCustomNamedNodeModal}
                        //  this shows the template view
                        templateView={showTemplateView}
                        BorderlessTableOutlined={BorderlessTableOutlined}
                        // this sets the grid background
                        gridOn={gridOn}
                        // this sets the grid layout checkbox
                        setGrid={setGrid}
                        // this sets the grid snap on or off
                        snapOn={snapOn}
                        // this sets the grid snap on
                        setGridSnap={setGridSnap}
                        // Show PNR bags
                        showByPNR={showByPNR}
                        setShowByPNR={setShowByPNR}
                        // this is to create the final data edited and save it in the database
                        createDataForDbJSON={createDataForDbJSON}
                        // this set the map editable or not
                        setMapEditable={setMapEditableFunc}
                        // this pass the template data which is set by the setter
                        templateFetchedData={templateFetchedData}
                        // editOptionVisibility={view=='gateView'?true:false}
                        // shows if the edit button is visible or not
                        editOptionVisibility={setVisibilityOfEdit()}
                        // sends the view of display {airport or gate view}
                        view={view}
                        // this is to show the pnr controls in the bottom of the map
                        setShowPnrControlsFunc={setShowPnrControlsFunc}

                    />
                    {/* bottom controls */}
                    {mapEditable && (
                        <BottomControl
                            displayCustomNamedNodeModal={displayCustomNamedNodeModal}
                            createDataForDbJSON={createDataForDbJSON}
                        />
                    )}

                    {showPnr && (
                        <ShowPnrControls
                            // this is to get the pnr number input
                            setPnrNumberInput={setPnrNumberInput}
                            // this is to send the array of all the guids
                            showAllGuids={showAllGuids}
                            // this is to fetch the selected guid from the dropdown
                        setSelectedGUID={setSelectedGUID}

                        selectedGuid = {selectedGuid}
                            // Will be true when new pnr is entered
                            validPnr = {validPnr}
                        />
                    )}

                </ReactFlow>

                <div></div>
            </div>
        </>
    );
};

// returns react flow render
export default ReactFlowRenderer;
