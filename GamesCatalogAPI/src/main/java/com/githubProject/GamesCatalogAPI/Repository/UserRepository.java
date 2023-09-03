package com.githubProject.GamesCatalogAPI.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.githubProject.GamesCatalogAPI.Model.User;

public interface UserRepository extends MongoRepository<User, String>{

    User findByEmail(String email);

}
