import './App.css'
import {BrowserRouter} from "react-router-dom";
import {AppRoutes} from "./routes/app.tsx";
import {App as MessageApp} from "antd"


function App() {
    return (<BrowserRouter>
        <MessageApp>
            <AppRoutes/>
        </MessageApp>
    </BrowserRouter>);
}

export default App
