
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


import SignupPage from './Pages/Signup';

import Login from './Pages/Login';
import Shelf from './Pages/Shelf';
import { ToastContainer } from 'react-toastify';
import BookViewer from './Pages/BookViewer';
import { MessageProvider } from './Contexts/MessageContext';
import { useSSE } from './sse';

const App = () => {
  
  useSSE();
  return (
    <MessageProvider>
    <Router basename='/app/ui'>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/bookshelf" element={<Shelf />} />
        <Route path='/view-pdf/:id' element={<BookViewer />} /> {/**Id here is Book Id* /}
        {/* Add other routes as needed */}
      </Routes>
    </Router>
    </MessageProvider>
  );
};

export default App;
