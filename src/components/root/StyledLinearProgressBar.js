import { styled } from '@mui/material'
import LinearProgress, {
  linearProgressClasses
} from '@mui/material/LinearProgress'
import React from 'react'
import { useEmulatorStore } from '../../stores/emulator/store.tsx'

export default function LinearProgressBar() {
  const isLoading = useEmulatorStore((state) => state.isLoading)

  if (isLoading) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%' }}>
        <StyledLinearProgressBar />
      </div>
    )
  } else return null
}

const StyledLinearProgressBar = styled(LinearProgress)({
  [`&.${linearProgressClasses.determinate}`]: { backgroundColor: '#f0f' },
  [`&.${linearProgressClasses.determinate} > .${linearProgressClasses.bar1Determinate}`]:
    { backgroundColor: '#0ff' }
})
