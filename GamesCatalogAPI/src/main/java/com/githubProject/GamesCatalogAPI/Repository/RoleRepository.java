package com.githubProject.GamesCatalogAPI.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.githubProject.GamesCatalogAPI.Model.Role;

public interface RoleRepository extends MongoRepository<Role, String> {
    Role findByName(String name);
}
