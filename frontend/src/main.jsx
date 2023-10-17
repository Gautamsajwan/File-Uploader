import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import { Flip, Slide, ToastContainer, Zoom } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastContainer
      position="top-center"
      autoClose={4000}
      newestOnTop={true}
      transition={Flip}
      theme="dark"
      className="text-base capitalize tracking-wide"
    />
    <App />
  </React.StrictMode>,
)
