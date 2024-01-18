import React, { useEffect, useRef} from 'react'
import useMarkerStore from '../../../../stores/emulator/markerStore.js'
import './styles.css'

// Codesandbox runs React in dev mode, this has a massive performance impact
// In production mode React handles quite a lot of moving elements.
// The difference between React and transient updates is drastic still,
// but this demo can't show you the real-world (production) difference :(

function ItemFast({ id }) {
  // Set up a spring first, fetch it's "set" method
  // Bind component to store, forward changed coordinates transiently
  const stateRef = useRef()
  const ref = useRef()
  useEffect(() => useMarkerStore.subscribe(state => stateRef.current = state[id]), [id])
  console.log('i only render once')

  useEffect(() => {
    function renderLoop() {
      console.log('xy', stateRef.current)
      requestAnimationFrame(renderLoop)
    }
    ref.current.innerText = 'xy ' + stateRef.current? `lat: ${stateRef.current?.lat}, lng: ${stateRef.current?.lat}` : 'no data'
    renderLoop()
  }, [])

  return <div class="box" ref={ref} />
}

export default function EmulatorMarker3() {
  console.log('app only render once')
  const items = useMarkerStore((state) => state.items)

  return (
    <div className="main" style={{ background: '#272737' }}>
      <div className="graph">
        {items?.map((id, index) => (
          <ItemFast key={id} id={id} />
        ))}
      </div>
      <span className="descr">150 connected components {'pass data through'}</span>
    </div>
  )
}
