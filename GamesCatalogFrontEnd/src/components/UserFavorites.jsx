import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

/**
 * UserFavorites is a component for render the favorite games from the logged user.
 *
 * @returns {JSX.Element} - The rendered user favorites page component.
 */
const UserFavorites = () => {
    // State to store favorite games, user ID, and login status
    const [favoriteGames, setFavoriteGames] = useState([]);
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    
    // Function to handle removing a game from favorites calling the API method to it
    const handleRemoveFavorite = async(userId, gameId) => {
        try {
            await axios.post(`/api/removeGameFromFavorites/${gameId}/${userId}`)
            console.log("Game Successfully removed from your favorites")
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    // Use useEffect to fetch user's favorite games when the component mounts or when user ID changes
    useEffect(() => {
        const fetchData = async () => {
            await checkLogin();
            if (userId) {
                try {
                    const response = await axios.get(`/api/getUserFavorites/${userId}`);
                    setFavoriteGames(response.data); 
                } catch (error) {
                    console.error('Erro ao obter favoritos', error);
                }
            }
        };
        
        fetchData();
    }, [userId]); 

    return (
        <main>
        <div className="container mt-5">
            <h1 className="mb-4" id='MainText'>My Favorite Games</h1>
            {favoriteGames.length === 0 ? (
                <p>No favorite games found.</p>
            ) : (
                favoriteGames.map((game) => (
                    <div id="gameRow" className="row mb-4" key={game.id}>
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

                            <div className="gameLinks">
                                <Link to={`/gameDetails/${game.id}`} id="detailsLink">
                                    Game Details
                                </Link>
                                <button onClick={() => handleRemoveFavorite(userId, game.id)} id='favoriteLink'>Remove Game From Favorites</button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </main>
    );
};

export default UserFavorites;
