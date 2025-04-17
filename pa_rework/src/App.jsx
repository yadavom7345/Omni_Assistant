import Navbar from '../components/navbar'
import MessageBox from '../components/message_box'
import SendMessage from '../components/send_message'
import './App.css'

function App() {

  return (
    <>
      <div className='bg-white h-screen w-screen flex flex-col items-center justify-center pt-14'>
        <Navbar />
        <MessageBox />
      </div>
      
    </>
  )
}

export default App
