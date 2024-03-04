import Alert from '@mui/material/Alert'
import LinearProgress from '@mui/material/LinearProgress'
import React, { Suspense } from 'react'
import { Await, useLoaderData, useOutlet } from 'react-router-dom'
import { AuthProvider } from '../hooks/useAuth'

export const AuthLayout = () => {
  const outlet = useOutlet()
  const { userPromise } = useLoaderData()

  return (
    <Suspense fallback={<LinearProgress />}>
      <Await
        resolve={userPromise}
        errorElement= {<Alert severity="error">Something went wrong!</Alert>}
      >
        {(clientData) => (
          <AuthProvider
            clientData={clientData}
          >
            {outlet}
          </AuthProvider>
        )}
      </Await>
    </Suspense>
  )
}
