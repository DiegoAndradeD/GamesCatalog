package com.githubProject.GamesCatalogAPI.Controller;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.githubProject.GamesCatalogAPI.Model.Game;
import com.githubProject.GamesCatalogAPI.Model.User;
import com.githubProject.GamesCatalogAPI.Service.UserService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class UserRegistrationController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Endpoint to register a user.
     * @return ResponseEntity httpStatus CREATED to a successfull sign up.
     */
    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(
            @RequestParam("fullName") String fullName,
            @RequestParam("email") String email,
            @RequestParam("password") String password) {

        try {
            userService.createUser(fullName, email, password);
            return ResponseEntity.status(HttpStatus.CREATED).body("User Registered Successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error registering user" + e.getMessage());
        }
    }
    
    /**
     * Endpoint for user login.
     * Check user collection parameter matching in MongoDB
     * Creates a session for the logged in user.
     * @return ResponseEntity .
    */
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            HttpSession session) {
        try {
            User user = userService.findByEmail(email);
            if (user != null && passwordEncoder.matches(password, user.getPassword())) {
                session.setAttribute("user", user);
                return ResponseEntity.ok("Authentication successful.");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during authentication");
        }
    }

    /**
     * Checks for a user in the session.
     * @return boolean .
    */
    @GetMapping("/check-login")
    public boolean checkLogin(HttpSession session) {
        User user = (User) session.getAttribute("user");
        return user != null;
    }
    
    /**
     * Gets user info
     * Checks if a user is present in the session
     * @return ResponseEntity containing the user.
    */
    @GetMapping("/get-user-info")
    public ResponseEntity<User> getUserInfo(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    /**
     * Invalidates the session to logout the user
     * @return ResponseEntity with httpStatus.
    */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        try {
            session.invalidate();
            return ResponseEntity.ok("Logout successful.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during logout");
        }
    }

    /**
     * Adds a game to a user with both game and user id...
     * ...Calling the method from the user service class
     * @return ResponseEntity with httpStatus.
    */
    @PostMapping("/addFavorite/{gameId}/{userId}")
    public ResponseEntity<String> addGameToFavorite(
            @PathVariable String gameId,
            @PathVariable String userId) {
        userService.addGameToUser(userId, gameId);
        return ResponseEntity.ok("Game added to your favorites successfully.");
    }

    /**
     * Gets all the user's favorite games by...
     * ...Calling the method from the user service class to...
     * ...Find the user by the id, and get it's favorite games
     * @return ResponseEntity containing the favoriteGames.
    */
    @GetMapping("/getUserFavorites/{userId}")
    public ResponseEntity<Set<Game>> getUserFavorites(@PathVariable String userId) {
        User user = userService.findUserById(userId);
        Set<Game> favoriteGames = user.getGames();
        return ResponseEntity.ok(favoriteGames);
    }

    /**
     * Removes a game to a user with both game and user id...
     * ...Calling the method from the user service class
     * @return ResponseEntity with httpStatus.
    */
    @PostMapping("/removeGameFromFavorites/{gameId}/{userId}")
    public ResponseEntity<String> removeGameFromFavorites(
            @PathVariable String gameId,
            @PathVariable String userId) {
        userService.removeGameFromUser(userId, gameId);
        return ResponseEntity.ok("Game removed from your favorites successfully.");
    }
}
