package com.githubProject.GamesCatalogAPI.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.githubProject.GamesCatalogAPI.Model.Game;
import com.githubProject.GamesCatalogAPI.Repository.GameRepository;

@Service
public class GameService {

    /**
     * This is service class is responsible for just implement again a Repository method
     * Future bussiness logic may be added in this class
    */

    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    public Game saveGame(Game game) {
        return gameRepository.save(game);
    }

    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    public Game getGameById(String id) {
        return gameRepository.findById(id).orElse(null);
    }

    
}
