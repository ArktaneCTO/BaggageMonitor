import { Background } from "react-flow-renderer"

const RightControls = ({ templateView, BorderlessTableOutlined, gridOn, setGrid, snapOn, setGridSnap, showByPNR, setShowByPNR, setMapEditable, templateFetchedData, editOptionVisibility, view, setShowPnrControlsFunc }) => {
    let templates = ""
    //console.log(view)

    if (templateFetchedData) {
        //console.log(templateFetchedData)
        templates = templateFetchedData.map(template =>
        // //console.log(Object.keys(template)),
        {
            if (template.view == view) {
                //console.log(template)
                return (<>
                    <li><a className="dropdown-item" value={template?.templateName} onClick={templateView} >
                        {template?.templateName}
                    </a>
                    </li>
                </>)
            }

        }
        )
    }

    // alert(editOptionVisibility)

    let editButton = (<></>)
    if (editOptionVisibility == true) {
        editButton = (
            <>
                <button className="react-flow__controls-button react-flow__controls-interactive" title="Edit Mode" onClick={setMapEditable}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fillRule="evenodd" d="M15.586 3a2 2 0 0 1 2.828 0L21 5.586a2 2 0 0 1 0 2.828L19.414 10 14 4.586 15.586 3zm-3 3-9 9A2 2 0 0 0 3 16.414V19a2 2 0 0 0 2 2h2.586A2 2 0 0 0 9 20.414l9-9L12.586 6z" clipRule="evenodd" /></svg>
                </button>
            </>
        )
    }






    return (
        <>
            <div className="react-flow__attribution bottom right " style={{ marginRight: "7vh", marginBottom: "3vh" }}>



                <button className="react-flow__controls-button react-flow__controls-interactive " type="button" data-bs-toggle="dropdown" aria-expanded="false" title="User Preset"  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fillRule="evenodd" clipRule="evenodd" d="M7.49999 3.09998C7.27907 3.09998 7.09999 3.27906 7.09999 3.49998C7.09999 3.72089 7.27907 3.89998 7.49999 3.89998H14.5C14.7209 3.89998 14.9 3.72089 14.9 3.49998C14.9 3.27906 14.7209 3.09998 14.5 3.09998H7.49999ZM7.49998 5.1C7.27907 5.1 7.09998 5.27908 7.09998 5.5C7.09998 5.72091 7.27907 5.9 7.49998 5.9H14.5C14.7209 5.9 14.9 5.72091 14.9 5.5C14.9 5.27908 14.7209 5.1 14.5 5.1H7.49998ZM7.1 7.5C7.1 7.27908 7.27909 7.1 7.5 7.1H14.5C14.7209 7.1 14.9 7.27908 14.9 7.5C14.9 7.72091 14.7209 7.9 14.5 7.9H7.5C7.27909 7.9 7.1 7.72091 7.1 7.5ZM7.49998 9.1C7.27907 9.1 7.09998 9.27908 7.09998 9.5C7.09998 9.72091 7.27907 9.9 7.49998 9.9H14.5C14.7209 9.9 14.9 9.72091 14.9 9.5C14.9 9.27908 14.7209 9.1 14.5 9.1H7.49998ZM7.09998 11.5C7.09998 11.2791 7.27907 11.1 7.49998 11.1H14.5C14.7209 11.1 14.9 11.2791 14.9 11.5C14.9 11.7209 14.7209 11.9 14.5 11.9H7.49998C7.27907 11.9 7.09998 11.7209 7.09998 11.5ZM2.5 9.25003L5 6.00003H0L2.5 9.25003Z" fill="currentColor" /> </svg>
                </button>
                <ul className="dropdown-menu">
                    {templates}
                </ul>




                <button className="react-flow__controls-button react-flow__controls-interactive" title="Show Grid View"
                    onClick={(event) => setGrid(!gridOn)}
                    style={gridOn ? { backgroundColor: "lightblue" } : { backgroundColor: "white" }}>
                    <BorderlessTableOutlined />
                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-activity" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z"/> </svg> */}
                </button>
                {editButton}


                <button className="react-flow__controls-button react-flow__controls-interactive" title="Strict Arrange Edge"
                    onClick={(event) => setGridSnap(!snapOn)}
                    style={snapOn ? { backgroundColor: "lightblue" } : { backgroundColor: "white" }}>
                    <svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.022 10l-3.26-7.965-.925.38L5.94 10H5v4h1.4l-1.503 7.722.981.191L7.42 14H9v-4zM8 13H6v-2h2zm10-7h-6v4h6a2 2 0 0 1 0 4h-6v4h6a6 6 0 0 0 0-12zm-3 3h-2V7h2zm0 8h-2v-2h2zm3 0h-2v-2h2a3 3 0 0 0 0-6h-2V7h2a5 5 0 0 1 0 10z" /><path fill="none" d="M0 0h24v24H0z" /></svg>
                </button>

                <button className="react-flow__controls-button react-flow__controls-interactive" title="Show Path"
                    onClick={(event) => {
                        setShowByPNR(!showByPNR)
                        setShowPnrControlsFunc()
                    }}
                    style={showByPNR ? { backgroundColor: "lightblue" } : { backgroundColor: "white" }}>
                    <svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm6 10a1 1 0 0 0 1-1 7 7 0 0 0-14 0 1 1 0 0 0 1 1z" data-name="person"></path></svg>
                </button>
            </div>
        </>

    );
}

export default RightControls;