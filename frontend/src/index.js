import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <App />
    {/* custom styling for bs-buttons */}
    <style>
      {`
            .btn-outline-own {
              color: #4e564b;
              border-color: #4e564b;
              border-width: medium;
              font-weight: bold;
            }
            .btn-outline-own:hover {
              color: white;
              background-color:  #4e564b;
            }
  
            .btn-outline-ownLight {
              color: #20752f;
              border-color: #20752f;
              font-weight: bold;
              border-width: medium;
            }
            .btn-outline-ownLight:hover {
              color: white;
              background-color:  #20752f;
            }
            .btn.btn-ownLight:active {
              color: white;
              background-color: #20752f; 
            }
            .alert {
              margin-bottom: 0px !important; 
            }
          `}
    </style>
  </React.StrictMode>,
  document.getElementById('root')
);

// change unregister to register to use serviceWorker
serviceWorker.unregister();
