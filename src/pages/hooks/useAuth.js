import { React, createContext, useCallback, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ApiService from '../../ApiService.js'
import { CLIENT_LOGIN } from '../../constants.js'
import { useEmulatorStore } from '../../stores/emulator/store.tsx'
import { useLocalStorage } from './useLocalStorage.tsx'

const AuthContext = createContext()

export const AuthProvider = ({ children, clientData }) => {
  /*
  let token = client.token; // Accessing 'token'
  let roleType = client.role_TYPE; // Accessing 'role_TYPE'
  let authority = client.role_TYPE[0].authority; // Accessing 'authority' inside the first object of 'role_TYPE' array
  */
  const logoutEmulatorStore = useEmulatorStore((state) => state.logout)
  const [client, setClient] = useLocalStorage('client', clientData)

  const navigate = useNavigate()

  const login = useCallback(
    async (loginRequest) => {
      const payload = {
        email: loginRequest.email,
        password: loginRequest.password
      }
      const { success, data, error } = await ApiService.makeApiCall(
        CLIENT_LOGIN,
        'POST',
        payload,
        null
      )
      if (success) {
        // add isLoggedIn field to data as true and save to localStorage
        data.isLoggedIn = true
        setClient(data)
        localStorage.setItem('token', data.token)
        // for each role type, check if it includes 'ROLE_ADMIN'
        let isAdmin = false
        data.role_TYPE.forEach((role) => {
          if (role.authority.includes('ROLE_ADMIN')) {
            isAdmin = true
          }
        })
        if (isAdmin) {
          navigate('/license')
        } else {
          navigate('/gps')
        }
      }
      return { success, data, error }
    },
    [navigate, setClient]
  )

  const logout = useCallback(() => {
    setClient(null)
    localStorage.removeItem('token')
    logoutEmulatorStore()
    navigate('/', { replace: true })
  }, [logoutEmulatorStore, navigate, setClient])

  const value = useMemo(
    () => ({
      client,
      login,
      logout
    }),
    [client, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
