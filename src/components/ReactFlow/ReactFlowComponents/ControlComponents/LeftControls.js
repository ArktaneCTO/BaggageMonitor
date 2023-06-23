import "./controlComponentsCss/ReactFlow.css"
const LeftControls = ({saveTemplateOfUser}) => {
    return (
        <div>
            <button className="react-flow__controls-button react-flow__controls-interactivey" onClick={saveTemplateOfUser} title="Save User Template" data-bs-toggle="modal" data-bs-target="#userTemplateDetailModal">

            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-save" viewBox="0 0 16 16"> <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" /> </svg>
            </button>



            <div className="modal fade" id="userTemplateDetailModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">



                            <div className="mb-3">
                                <label htmlFor="TemplateName" className="form-label">Enter Template Name Here</label>
                                <input type="text" className="form-control" id="TemplateName" name="TemplateName" title="Enter Your Template Name" />

                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={saveTemplateOfUser}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeftControls;