import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Nav from './Components/Navigation/Nav.tsx'
import { UserProvider } from './hooks/MainUser/useMainUser.tsx'
import Profile from './Components/Profiles/Profile.tsx'
import ChatComponent from './Components/Chat/ChatComponent.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/chat' element={<ChatComponent />} />
          <Route path='/app/profile' element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>,
)
