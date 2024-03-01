import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import ReactSpeedometer from 'react-d3-speedometer'
import { useEmulatorStore } from '../../../../stores/emulator/store.tsx'
import './styles.css'

const Speedometer = () => {
  // meters per millisecond to miles per hour

  const [speed, setSpeed] = useState()
  const [currentValueText, setCurrentValueText] = useState('N/A MPH')
  const emulator = useEmulatorStore.getState().connectedEmulator

  useEffect(() => {
    console.log('TEST@ emulator useEffect : ', emulator?.velocity)
    if (emulator) {
      const speed = (emulator.velocity * 2236.94).toFixed(2)
      setSpeed(speed)
      setCurrentValueText(speed + ' MPH')
    }
  }, [emulator])

  useEffect(
    () =>
      useEmulatorStore.subscribe(
        (state) => state.connectedEmulator,
        (connectedEmulator) => {
          if (
            connectedEmulator === null ||
            connectedEmulator === undefined ||
            connectedEmulator?.velocity === null ||
            connectedEmulator?.velocity === undefined
          ) {
            return
          }
          const speed = (connectedEmulator.velocity * 2236.94).toFixed(2)
          // update ReactSpeedometer value with speed
          setSpeed(speed)
          setCurrentValueText(speed + ' MPH')
        }
      ),
    []
  )

  return (
    <div className="center">
      <Container>
        <Row>
          <Col>
            <div className="speedometer">
              <ReactSpeedometer
                needleHeightRatio={0.8}
                labelFontSize={'10px'}
                width={200}
                height={130}
                needleColor="#007fff"
                maxValue={100}
                ringWidth={20}
                customSegmentStops={[
                  0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
                ]}
                segmentColors={[
                  '#FAFAFA',
                  '#FAFAFA',
                  '#FAFAFA',
                  '#0058A54D',
                  '#0058A54D',
                  '#0058A54D',
                  '#0058A54D',
                  '#FAFAFA',
                  '#FAFAFA',
                  '#FAFAFA',
                  '#FAFAFA'
                ]}
                needleTransitionDuration={3000}
                needleTransition="easeElastic"
                currentValueText={currentValueText}
                value={speed}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Speedometer