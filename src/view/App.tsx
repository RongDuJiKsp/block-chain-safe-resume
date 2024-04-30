import './App.css';
import {BrowserRouter} from "react-router-dom";
import {AppRoutes} from "./routes/app.tsx";
import {App as MessageApp, ConfigProvider} from "antd";


function App() {
    return (<BrowserRouter>
        <MessageApp>
            <ConfigProvider theme={{
                components: {
                    Layout: {
                        headerBg: "#fff"
                    }
                }
            }}>
                <AppRoutes/>
            </ConfigProvider>
        </MessageApp>
    </BrowserRouter>);
}

export default App;
