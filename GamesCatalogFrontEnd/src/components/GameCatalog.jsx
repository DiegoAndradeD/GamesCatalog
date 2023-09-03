import React, { useState, useEffect } from 'react';
import {Routes, Route, useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import '../styles/catalog.css'; 


/**
 * GameCatalog is a component that displays a catalog of games and allows users to filter...
 * ...games by developer and add games to their favorites.
 *
 * @returns {JSX.Element} - The rendered game catalog component.
 */
const GameCatalog = () => {

    const navigate = useNavigate();

    // State to manage game data, user ID, and login status
    const [games, setGames] = useState([]);
    const [userId, setUserId] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // State to manage developers and the selected developer filter
    const [developers, setDevelopers] = useState([]);
    const [selectedDeveloper, setSelectedDeveloper] = useState('All'); // State to store selected developer

    // State to store filtered games based on the developer filter
    const [filteredGames, setFilteredGames] = useState([]);

    /**
   * Handles adding a game to the user's favorites.
   * Calls the add favorite method from the API
   * Navigates to favorites after adding the game
   * @param {string} gameId - The ID of the game to add to favorites.
   * @param {string} userId - The ID of the user.
   */
    const handleFavorite = async (gameId, userId) => {
        try {
            await axios.post(`/api/addFavorite/${gameId}/${userId}`)
            console.log("Game Successfully added to your favorites")
            navigate("/favorites")
            window.location.reload(); 
        } catch (error) {
            console.log(error);
        }
       
    }

    /**
     * Gets the user information from the api.
     * Calls the check-login method from the api to check if the user is logged in
     * If so, calls the get-user-info method to get and set the id of the logged user
     */
    const checkLogin = async () => {
        try {
            const response = await axios.get("/api/check-login", { withCredentials: true });
            setIsLoggedIn(response.data);
            if (response.data === true) {
                const userInfoResponse = await axios.get("/api/get-user-info", { withCredentials: true });

                setUserId(userInfoResponse.data.id);
            }
        } catch (error) {
            setIsLoggedIn(false);
            console.error(error);
        }
    }
    
    //Filters games by the selected developer.
    const filterGamesByDeveloper = () => {
        if (selectedDeveloper === 'All') {
          setFilteredGames(games); // Use the original list of games
        } else {
          const filteredGames = games.filter((game) => game.developer === selectedDeveloper);
          setFilteredGames(filteredGames);
        }
      };
    
      useEffect(() => {
        // Fetch user info and game data on component mount
        checkLogin();
        axios
          .get('http://localhost:8080/api/games')
          .then((response) => {
            setGames(response.data);
            const allDevelopers = response.data.map((game) => game.developer);
            const uniqueDevelopers = [...new Set(allDevelopers)];
            setDevelopers(uniqueDevelopers);
            // Initially set filtered games to all games
            setFilteredGames(response.data);
          })
          .catch((error) => {
            console.error('Error getting API data', error);
          });
      }, []);
    
      useEffect(() => {
        // Call the filter function whenever selectedDeveloper changes
        filterGamesByDeveloper();
      }, [selectedDeveloper]);
    
      return (
        <main>
          <div className="container mt-5">
            <h1 className="row mb-5" id="MainText">
              GAMES CATALOG
            </h1>
            <div className="developer-filter mb-4" >
            <label htmlFor="developerFilter" className="filter-label">
                Filter by Developer:
            </label>
            <select
                id="developerFilter"
                className="filter-select"
                value={selectedDeveloper}
                onChange={(e) => setSelectedDeveloper(e.target.value)}
            >
                <option value="All">All Developers</option>
                {developers.map((developer) => (
                <option key={developer} value={developer}>
                    {developer && developer.charAt(0).toUpperCase() +developer.slice(1)}
                </option>
                ))}
            </select>
            </div>
           {filteredGames.map(game => (
                    <div id='gameRow' className="row mb-4" key={game.id}>
                        <div className="col-md-4">
                            <img
                                src={`data:image/jpeg;base64,${game.cover}`}
                                alt={game.title}
                                className="img-fluid"
                                id="bookCover"
                            />
                        </div>
                        <div className="col-md-8 gameData">
                            <h2 id="gameTitle">{game.title}</h2>
                            <p>{game.description}</p>
    
                            <div className='gameLinks'>
                        <Link to={`/gameDetails/${game.id}`} id='detailsLink'>Game Details</Link>
                        <button onClick={() => handleFavorite(game.id, userId)} id='favoriteLink'>Add Game To Favorites</button>
                    </div>
                        </div>
                    </div>
                ))}
          </div>
        </main>
      );
    };
    
    export default GameCatalog;
