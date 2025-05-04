import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import axios from "axios"

axios.defaults.baseURL = "https://pixelshare-backend-aqfse0aua2e4cmg9.uksouth-01.azurewebsites.net/"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
