const BottomControl = ({displayCustomNamedNodeModal,createDataForDbJSON}) => {
    return ( 
        <>                  <div style={{margin:"auto",width:"14%",backgroundColor:"rgba(255,0,0,0.5)",border:"1px solid black",borderRadius:"8px"}}>
                            <h5 style={{ textAlign: "center" ,color:"grey"}}><b>Editing Mode</b></h5>
                            </div>
                            <div>
                                <div className="react-flow__attribution bottom center " style={{ marginBottom: "3vh", display: "flex" }}>



                                    <button className="react-flow__controls-button react-flow__controls-interactive" onClick={displayCustomNamedNodeModal} title="Add Custom Node">
                                        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M3 3h14v14H3V3zm12 12V5H5v10h10zm-8 6v-2h12V7h2v14H7zm4-12h2v2h-2v2H9v-2H7V9h2V7h2v2z" fill="currentColor" /> </svg>
                                    </button>


                                    <button className="react-flow__controls-button react-flow__controls-interactive" title="Save To Database" onClick={createDataForDbJSON}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-save" viewBox="0 0 16 16"> <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" /> </svg>
                                    </button>

                                    <button className="react-flow__controls-button react-flow__controls-interactive" title="Activity Button add">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-activity" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z" /> </svg>
                                    </button>
                                    <button className="react-flow__controls-button react-flow__controls-interactive" title="Activity Button add">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-activity" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z" /> </svg>
                                    </button>

                                    <button className="react-flow__controls-button react-flow__controls-interactive" title="Activity Button add">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-activity" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z" /> </svg>
                                    </button>


                                </div>
                            </div>
                        </>
     );
}
 
export default BottomControl ;