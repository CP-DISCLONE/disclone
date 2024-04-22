import { ReactElement } from "react";


const LogInForm: React.FC = (): ReactElement => {

    return (
        <div className="login-form">
            <h1>Log In</h1>
            <form>
                <label>Email</label>
                <input type="email" placeholder="Email" />
                <label>Password</label>
                <input type="password" placeholder="Password" />
                <button type="submit">Log In</button>
            </form>
        </div>
    )
}

export default LogInForm;