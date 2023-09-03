package com.githubProject.GamesCatalogAPI.Service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.githubProject.GamesCatalogAPI.Model.Game;
import com.githubProject.GamesCatalogAPI.Model.Role;
import com.githubProject.GamesCatalogAPI.Model.User;
import com.githubProject.GamesCatalogAPI.Repository.GameRepository;
import com.githubProject.GamesCatalogAPI.Repository.RoleRepository;
import com.githubProject.GamesCatalogAPI.Repository.UserRepository;
import com.githubProject.GamesCatalogAPI.exception.EmailAlreadyExistsException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Autowired
    private GameRepository gameRepository;


    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Method to create a user(Called for the register process)
     * Instanciate a new user
     * Encrypt it's password
     * Create a role
     * Test for if the role does not exist in the database, if so, save it.
    * Grant it a Role(Can be changed both in this method or in the MongoDB collection)
     * @return a call to the user repository to save the new user.
    */
    public User createUser(String fullName, String email, String password) {
        if (fullName == null || email == null || password == null || fullName.isEmpty() || email.isEmpty() || password.isEmpty()) {
            throw new IllegalArgumentException("FullName, email, e Must be informed.");
        }
        
        if (userRepository.findByEmail(email) != null) {
            throw new EmailAlreadyExistsException("E-mail is already in use.");
        }

        if (!isPasswordStrong(password)) {
            throw new IllegalArgumentException("Password Too Weak");
        }
        User newUser = new User();
        newUser.setFullName(fullName);
        newUser.setEmail(email);
        
        String hashedPassword = passwordEncoder.encode(password);
        newUser.setPassword(hashedPassword);

        Role role = roleRepository.findByName("ROLE_USER");
        
        if (role == null) {
            role = new Role("ROLE_USER");
            roleRepository.save(role);
        }

        Set<Role> userRoles = new HashSet<>();
        userRoles.add(role);
        newUser.setRoles(userRoles);
        
        return userRepository.save(newUser);
    }

    /**
     * Searches for the user by its emmail.
    */
	public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Searches for the user by its id.
    */
    public User findUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    /**
     * Adds a game to the user.
     * Searches for the user and game by its ids
     * Checks for null results
     * Checks for empty Games Set structure of the user
     * Checks if the game isn't already in the uses favorites(games)
     * Adds the game to the user's games
     * Saves the user
    */
    public void addGameToUser(String userId, String gameId) {
    User user = userRepository.findById(userId).orElse(null);
    Game game = gameRepository.findById(gameId).orElse(null);
    if (user != null && game != null) {
        if (user.getGames() == null) {
            user.setGames(new HashSet<>()); 
        }
        
        if (!user.getGames().contains(game)) {
            user.getGames().add(game);
            userRepository.save(user);
            }
        }
    }

    /**
     * Removes a game from the user.
     * Searches for the user and game by its ids
     * Checks for null results
     * Checks for empty Games Set structure of the user
     * Checks if the game is in the uses favorites(games)
     * Removes the game to the user's games
     * Saves the user
    */
    public void removeGameFromUser(String userId, String gameId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return;
        }
        
        Game game = gameRepository.findById(gameId).orElse(null);
        if (game == null) {
            return;
        }
    
        Set<Game> userGames = user.getGames();
        if (userGames != null && userGames.contains(game)) {
            System.out.println("HERE");
            userGames.remove(game);
            userRepository.save(user);
        }
    }
    
    /**
     * Validation to password
    */
    public boolean isPasswordStrong(String password) {
        return password.length() >= 5 &&
               password.chars().anyMatch(Character::isUpperCase) &&
               password.chars().anyMatch(Character::isLowerCase) &&
               password.chars().anyMatch(Character::isDigit) &&
               password.matches(".*[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\\\-].*");
    }
    
}
