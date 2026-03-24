package com.inventory.backend.config;

import com.inventory.backend.model.Category;
import com.inventory.backend.model.Role;
import com.inventory.backend.repository.CategoryRepository;
import com.inventory.backend.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedData(RoleRepository roleRepo, CategoryRepository categoryRepo) {
        return args -> {
            if (roleRepo.count() == 0) {
                roleRepo.save(new Role("ADMIN"));
                roleRepo.save(new Role("USER"));
            }
            if (categoryRepo.count() == 0) {
                categoryRepo.save(new Category("Electronics"));
                categoryRepo.save(new Category("Clothing"));
                categoryRepo.save(new Category("Food"));
                categoryRepo.save(new Category("Books"));
                categoryRepo.save(new Category("Furniture"));
                categoryRepo.save(new Category("Other"));
            }
        };
    }
}