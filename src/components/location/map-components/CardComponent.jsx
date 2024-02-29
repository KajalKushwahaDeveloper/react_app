// CardComponent.jsx
import { Card } from '@material-ui/core'
import React from 'react'

const CardComponent = ({ children }) => {
  return <Card variant="outlined">{children}</Card>
}

export default CardComponent
