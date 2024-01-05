import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Nav from './Components/Navigation/Nav.tsx'
import { UserProvider } from './hooks/useUser.tsx'
import Profile from './Components/Profiles/Profile.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/chat/profile",
    element: <Profile />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <Nav />
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>,
)
