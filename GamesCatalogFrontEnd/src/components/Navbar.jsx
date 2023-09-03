import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

/**
 * Navbar is a component for the navigation bar.
 *
 * @returns {JSX.Element} - The rendered navigation bar component.
 */
const Navbar = () => {
    const navigate = useNavigate();
    //States to user's information
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [userRoles, setUserRoles] = useState("");

    useEffect(() => {
        checkLogin();
    }, []);

    /**
     * Gets the user information from the api.
     * Calls the check-login method from the api to check if the user is logged in
     * If so, calls the get-user-info method to get and set the roles and email of the logged user
     */
    const checkLogin = async () => {
        try {
            const response = await axios.get("/api/check-login", { withCredentials: true });
            setIsLoggedIn(response.data);
    
            if (response.data === true) {
                const userInfoResponse = await axios.get("/api/get-user-info", { withCredentials: true });
                console.log(userInfoResponse.data.roles[0].name);
                setUserRoles(userInfoResponse.data.roles[0].name);
                setUserEmail(userInfoResponse.data.email);
            }
        } catch (error) {
            setIsLoggedIn(false);
            console.error(error);
        }
    }

    //Function to logout the user
    const Logout = async () => {
        try {
            await axios.post("/api/logout", { withCredentials: true });
            navigate("/")
            window.location.reload(); 
        } catch(error) {
            console.error(error);
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand d-flex align-items-center" to="/" id='HeaderTitle'>GAMES CATALOG</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/" id='HeaderText'>Catalog</Link>
                </li>
                {isLoggedIn ? (
                  <li className="nav-link dropdown">
                    <button
                          className="dropdown-toggle"
                          href="#"
                          role="button"
                          id="userMenu"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {userEmail}
                        </button>
                    <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                      <li>
                        <Link className="dropdown-item" to="/favorites">Favorites</Link>
                      </li>
                      {userRoles.includes("ROLE_ADMIN") && (
                        <li>
                          <Link className="dropdown-item" to="/add-game">AddGame</Link>
                        </li>
                      )}
                      <li>
                        <button className="dropdown-item" onClick={Logout}>Logout</button>
                      </li>
                    </ul>
                  </li>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" id='HeaderText'  to="/signup">Signup</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" id='HeaderText' to="/login">Login</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      
    )
}

export default Navbar;