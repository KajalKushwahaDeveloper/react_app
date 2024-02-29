import { create } from 'zustand'
import { EMULATOR_URL } from '../../constants'

async function initItems() {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(EMULATOR_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    const emulators = await response.json()
    const _ids = emulators.map((emulator) => emulator.id)
    useMarkerStore.setState({ items: _ids })
  } catch (error) {
    console.error('V2 Failed to fetch emulators:', error)
  }
}

const useMarkerStore = create((set) => ({
  items: [],
  initMarkers() {
    initItems()
  },
  advance(emulators) {
    if (!emulators) {
      return
    }
    set(() => {
      const coords = {}
      for (let i = 0; i < emulators.length; i++) {
        coords[emulators[i].id] = emulators[i]
      }
      return coords
    })
  },
  setItems: (items) => set({ items })
}))

export default useMarkerStore
