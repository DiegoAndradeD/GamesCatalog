package com.githubProject.GamesCatalogAPI.Controller;

import java.io.IOException;
import java.text.ParseException;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.githubProject.GamesCatalogAPI.Model.Game;
import com.githubProject.GamesCatalogAPI.Service.GameService;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class GameController {

    @Autowired
    private GameService gameService;

    /**
     * Get all games.
     * @return ResponseEntity containing a list of Game objects.
     */
    @GetMapping("/games")
    public ResponseEntity<List<Game>> getAllGames() {
        List<Game> games = gameService.getAllGames();
        return ResponseEntity.ok(games);
    }

     /**
     * Get a game by its ID.
     * @param id The ID of the game.
     * @return ResponseEntity containing the requested Game object or a 404 status if not found.
     */
    @GetMapping("/games/{id}")
    public ResponseEntity<Game> getGameById(@PathVariable String id) {
        Game game = gameService.getGameById(id);
        if(game != null) {
            return ResponseEntity.ok(game);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Upload a new game, saving it in the MongoDB.
     */
    @PostMapping("/addGame")
    public ResponseEntity<String> uploadGame(@RequestParam("cover") MultipartFile cover,
                                             @RequestParam("title") String title,
                                             @RequestParam("description") String description,
                                             @RequestParam("developer") String developer,
                                             @RequestParam("genre") Set<String> genre,
                                             @RequestParam("platform") Set<String> platform,
                                             @RequestParam("releaseDate") String releaseDate,
                                             @RequestParam("ageRating") String ageRating,
                                             @RequestParam("price") Double price) throws ParseException {
        try {
            Game game = new Game();
            game.setTitle(title);
            game.setDescription(description);
            developer = developer.toLowerCase().trim();
            game.setDeveloper(developer);
            game.setGenre(genre);
            game.setPlatform(platform);
            game.setReleaseDate(LocalDate.parse(releaseDate));
            game.setAgeRating(ageRating);
            game.setPrice(price);
            game.setCover(Base64.getEncoder().encodeToString(cover.getBytes()));
            gameService.saveGame(game);
            
            return ResponseEntity.status(HttpStatus.CREATED).body("Game added successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding game");
        }
    }


}
