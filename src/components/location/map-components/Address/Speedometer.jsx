import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import ReactSpeedometer from 'react-d3-speedometer'
import { useViewPort } from '../../../../ViewportProvider.js'
import { useEmulatorStore } from '../../../../stores/emulator/store.tsx'
import './styles.css'

const Speedometer = () => {
  // meters per millisecond to miles per hour

  const [speed, setSpeed] = useState()
  const [currentValueText, setCurrentValueText] = useState('N/A MPH')
  const emulator = useEmulatorStore.getState().connectedEmulator
  const speedometerRef = React.createRef()

  const { width } = useViewPort()
  const breakpoint = 620
  const isMobile = width < breakpoint

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
            connectedEmulator?.startLat === null ||
            connectedEmulator?.startLat === undefined ||
            connectedEmulator?.startLat === 0
          ) {
            speedometerRef.current.style.display = 'none'
            return
          }
          console.log(
            'TEST@ connectedEmulator useEffect : ',
            connectedEmulator.velocity
          )
          speedometerRef.current.style.display = 'block'
          const speed = (connectedEmulator.velocity * 2236.94).toFixed(2)
          // update ReactSpeedometer value with speed
          setSpeed(speed)
          setCurrentValueText(speed + ' MPH')
        }
      ),
    [speedometerRef]
  )

  console.log('TEST@ speed : ', speed)
  return (
    <div
      ref={speedometerRef}
      style={{
        display: 'none'
      }}
      className="center"
    >
      <Container>
        <Row>
          <Col>
            {!isMobile ? (
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
                  currentValueText={'AVG ' + currentValueText}
                  value={speed}
                />
              </div>
            ) : (
              <div className="mobileView_speedometer" style={{ textAlign: 'center', fontSize: '12px', paddingTop: '.5rem' }}>
                {'AVG ' + currentValueText}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Speedometer
