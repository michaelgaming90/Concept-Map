import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './jsx/App';

if("serviceWorker" in navigator)
{
  navigator.serviceWorker.register("/Concept-Map/Service_Worker.js")
    .then(registration => console.log(registration.scope))
    .catch(error => console.log(error));
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

