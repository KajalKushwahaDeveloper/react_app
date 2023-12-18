import React from "react";
import "./view.scss";

const PageNotFound = () => {
  console.log("Hello11");
  return (
    <div className="mainFourZeroFour">
      <h1 id="mainHead">404 Error</h1>
      <h1 id="pageNotFound">Page Not Found</h1>
      <h5 id="headingError">Out of nothing, something</h5>
      <h5 id="subHeadnig">You have entered wrong url</h5>
    </div>
  );
};

export default PageNotFound;