import React from "react";
import Sidebar from "../navbar/Sidebar";
import "./Base.css"

const Base = ({title="My title", description="", children}) => {
    return (
        <div id="base">
            <Sidebar pageWrapId={"base-content"} outerContainerId={"base"}/>
            <div id="base-content">
                <h1 className="text-center base-header">{title}</h1>
                <h5 className="text-center base-subheader">{description}</h5>
                <div className="base-subcontent">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Base