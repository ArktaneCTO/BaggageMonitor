import {  useEffect, useState } from "react";

const BottomControl = ({
  setPnrNumberInput,
  showAllGuids,
  setSelectedGUID,
  validPnr,
  selectedGuid
}) => {
  const getPnrInputDetails = () => {
    const pnrNumberInput = document.getElementById("pnrNumberField");
    let dataOfInputFieldPnr = pnrNumberInput.value;
    setPnrNumberInput(dataOfInputFieldPnr);
    ////console.log(pnrNumberInput.value);
  };

  function parsePassengerDataToShow(guid_Passenger_Data) {
    
    let passengerNames = [];
    if(validPnr && Array.isArray(guid_Passenger_Data))
   { let data = guid_Passenger_Data;
    // first obtain all the names in a set
    //console.log("called meee",Array.isArray(data),validPnr);
    
    data.forEach((d) => {
      if (!passengerNames.includes(d.passName)) {
        passengerNames.push(d.passName);
      }
    });
}
    return passengerNames;
  }

  const [namesOfPassengers, setNamesOfPassengers] = useState([]);
  const [guidsToShow, setGuid2Show] = useState([]);
  const [selectedPassenger, setSelectedPassenger] = useState("");
  const [showButton, setShowButton] = useState(true);

  const toggleButton = () => {
    setShowButton(!showButton);
  };

  useEffect(() => {
    
    ////console.log("test",guidsToShow.length);
    let namesOfPass = parsePassengerDataToShow(showAllGuids);
    ////console.log(showAllGuids);
    ////console.log(namesOfPass);
    let namePass = [];
    namePass = namesOfPass.map((element) => {
      return (
        <>
          <option value={element}> {element}</option>
        </>
      );
    });

    setNamesOfPassengers(namePass);
    ////console.log("name of pass", namesOfPass[0]);
    setSelectedPassenger(namesOfPass[0]);
  }, [showAllGuids]);

  useEffect(() => {
    if(validPnr && Array.isArray(showAllGuids)){
    ////console.log("selected Passenger", selectedPassenger);
    let guidsOfPassenger = showAllGuids.filter((element) => {
      return element.passName === selectedPassenger;
    });
    let guids = guidsOfPassenger.map((element) => {
      return (
        <>
          <option value={element.GUID}> {element.GUID}</option>
        </>
      );
    });
    setGuid2Show(guids);
    //console.log("guids To Show", guidsOfPassenger,selectedGuid);
    if (guidsOfPassenger.length > 0) {

      if(!selectedGuid){
        //console.log("inside")
        setSelectedGUID(guidsOfPassenger[0].GUID);
      }
    }}
  }, [selectedPassenger, showAllGuids, namesOfPassengers, setSelectedGUID]);

  function selectPassenger() {
    const selected = document.getElementById("selectPassengerField").value;
    ////console.log("selected in function passenger", selected);
    setSelectedPassenger(selected);
  }

  function selectGUID() {
    const selected = document.getElementById("selectGuidfield").value;
    //console.log("selected in function", selected);

    setSelectedGUID(selected);
  }

  useEffect(()=>{
//console.log("ValidPNR", validPnr)
  },[])

  return (
    <>
    
      <div class="container h-100">
        <div
          className="react-flow__attribution bottom center d-flex square border border-secondary border-2 rounded "
          style={{ marginBottom: "2vh", width: "auto" }}
        >
          <button  class="btn " style={{ padding: 0, margin: 0, width:"80px" }}
          >
            Enter PNR:
          </button>
          <span className="square border border-secondary border-2 rounded">
          <input
            className="react-flow__controls-button react-flow__controls-interactive text align-self-center"
            title="Enter Pnr Here"
            type="text"
            placeholder="Enter Pnr Here"
            style={{ width: "auto" }}
            name="pnrNumber"
            id="pnrNumberField"
          ></input>
          </span>
          
          <button
            className="react-flow__controls-button react-flow__controls-interactive square border border-secondary border-2 rounded"
            title="Search Pnr"
            style={{ width: "auto" }}
            onClick={getPnrInputDetails}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm-2.17-1.5l2.14-1.53 2.14 1.53-.83-2.46 2.15-1.5h-2.62L9.47 6l-.84 2.54H6l2.14 1.49z" />
            </svg>
          </button>
          {/* dropdown buttton for guid*/}
        
          <div class="vr"></div>
          {validPnr && <button  class="btn " style={{ padding: 0, margin: 0, width:"130px" }}
          >
            Select Passenger:
          </button>}
         {validPnr &&  <select
            class="react-flow__controls-interactive square border border-secondary border-2 rounded"
            id="selectPassengerField"
            onChange={selectPassenger}
          >
            {namesOfPassengers}
          </select>}
          <div class="vr"></div>
          {validPnr && <button  class="btn" style={{ padding: 0, margin: 0, width:"100px" }}
          >
            Select Bag:
          </button>}

          {validPnr && <select
            class="react-flow__controls-interactive square border border-secondary border-2 rounded"
            id="selectGuidfield"
            onChange={selectGUID}
          >
            {guidsToShow}
          </select>}
{/* 
          {validPnr && (
            <button
              className="react-flow__controls-button react-flow__controls-interactive square border border-secondary border-2 rounded"
              title="Activity Button add"
              style={{ display: "true" }}
              onClick={selectGUID}
            >Load
            </button>
          )} */}

          {/* <button
            className="react-flow__controls-button react-flow__controls-interactive square border border-secondary border-2 rounded"
            title="Activity Button add"
            style={{display:{validPnr}}}
            onClick={toggleButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-activity"
              viewBox="0 0 16 16"
            >
              {" "}
              <path
                fill-rule="evenodd"
                d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z"
              />{" "}
            </svg>
          </button> */}
        </div>
        
      </div>
    </>
  );
};

export default BottomControl;
