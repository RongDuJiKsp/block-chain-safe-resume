import "../../../app/(account)/login/page.css"
import {Link} from "react-router-dom";

function LoginPage() {
    return <div>
        <div className={"login-container-anima login-locations hover:flex-shadow"}>
            <Link to={"/register"}>WW</Link>
        </div>
    </div>
}

export default LoginPage;