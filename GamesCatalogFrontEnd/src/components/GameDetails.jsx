import { useEffect, useState } from "react";
import React from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import '../styles/catalog.css'; 


/**
 * GameDetails is a component that displays details of a specific game.
 *
 * @returns {JSX.Element} - The rendered game details component.
 */
const GameDetails = () => {
    const [game, setGame] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        // Fetch game details by ID when the component mounts
        axios.get(`http://localhost:8080/api/games/${id}`)
        .then(response => {
            console.log(response.data.releaseDate)
            setGame(response.data);
        })
        .catch(error => {
            console.error('Error Getting API data', error);
        });
    }, [id]);

    /**
     * Formats a given date string in the format [day, month, year] to YYYY-MM-DD.
     *
     * @param {Array} date - An array containing day, month, and year.
     * @returns {string} - The formatted date string in YYYY-MM-DD format.
     */
    const formatDate = (date) => {
        if (date && date.length === 3) {
          const year = date[2];
          const month = date[1] < 10 ? `0${date[1]}` : date[1];
          const day = date[0] < 10 ? `0${date[0]}` : date[0];
          return `${year}-${month}-${day}`;
        }
        return "";
    };
      

    return (
        <main>
            <div className="container mt-5">
            <h1 className="mb-4">Games Catalog</h1>
                <div id='gameRow' className="row mb-4" key={game.id}>
                    <div className="col-md-4">
                        <img src={`data:image/jpeg;base64,${game.cover}`} alt={game.title} className="img-fluid" id='bookCoverDetails' />
                    </div>
                    <div className="col-md-8 gameData">
                            <h2 id='gameTitle'>{game.title}</h2>
                            <p>{game.description}</p>
                            <div className="gameInfo">
                                <p>Developer: {game.developer && game.developer.charAt(0).toUpperCase() + game.developer.slice(1)}</p>
                                <p>Genres: {game.genre && game.genre.map((genre, index) => (
                                <React.Fragment key={genre}>
                                    {index !== 0 && ", "}
                                    {genre}
                                </React.Fragment>
                            ))}</p>


                            </div>
                            <div className="gameInfo">
                            <p>Platform: {game.platform && game.platform.map((platform, index) => (
                                <React.Fragment key={platform}>
                                    {index !== 0 && ", "}
                                    {platform}
                                </React.Fragment>
                            ))}</p>
                                <p>Release Date: {formatDate(game.releaseDate)}</p>
                            </div>
                            <div className="gameInfo">
                                <p>Age Rating: {game.ageRating}</p>
                                <p>Price: $ {game.price}.00</p>
                            </div>
                    </div>
                </div>
                </div>
        </main>
);
}

export default GameDetails;