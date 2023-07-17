// CardComponent.jsx
import React from "react";
import { Card } from "@material-ui/core";

const CardComponent = ({ children }) => {
  return <Card variant="outlined">{children}</Card>;
};

export default CardComponent;