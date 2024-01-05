import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Nav from './Components/Navigation/Nav.tsx'
import { UserProvider } from './hooks/useUser.tsx'
import Profile from './Components/Profiles/Profile.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <HashRouter>
        <Nav />
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/chat/profile' element={<Profile />} />
        </Routes>
      </HashRouter>
    </UserProvider>
  </React.StrictMode>,
)
