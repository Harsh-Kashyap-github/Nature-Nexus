import React, { useContext, useState } from 'react'
import Playground from '../routes/playground/Playground'
import Navbar from '../component/NavBar/Navbar'
import Sidebar from '../component/Sidebar/Sidebar';
import Leaderboard from '../routes/leaderboard/Leaderboard'
import About from '../routes/about/About'
import Rules from '../routes/rules/Rules'
import { UserContext } from './UserContext';
import Footer from '../component/Footer/Footer';

export default function App() {
    const [activeScreen,setActiveScreen]=useState('playground')
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const {user}=useContext(UserContext)
   
  return (
  <>
  <Navbar toggleSidebar={toggleSidebar}/>
  <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} setActiveScreen={setActiveScreen} user={user} />
  {
    (activeScreen==='playground') && <Playground/>
  }
  {
    (activeScreen ==='leaderboard') && <Leaderboard/>
  }
  {
    (activeScreen==='rules') && <Rules/>
  }
  {
    (activeScreen ==='about') && <About/>
  }
  <Footer/>
   </>
  )
}

