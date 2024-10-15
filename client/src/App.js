import './App.css';
import ChatPage from './components/ChatPage';
import Homepage from './components/Homepage';
import { Route,Routes } from 'react-router-dom';
import LoginPage from './components/Login.jsx';
import Signup from './components/Signup';

function App() {
  return (
    <div className="">
    <Routes>
    <Route path="/" element= {<Homepage/>} exact/>
    <Route path="/chats" element= {<ChatPage/>}/>
    <Route path="/login" element= {<LoginPage/>}/>
    <Route path="/signup" element= {<Signup/>}/>
    </Routes>
      
    </div>
  );
}

export default App;
