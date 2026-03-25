package com.inventory.backend.controller;

import com.inventory.backend.messaging.LowStockEvent;
import com.inventory.backend.messaging.LowStockProducer;
import com.inventory.backend.model.*;
import com.inventory.backend.repository.*;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Controller
public class ProductController {

    private final ProductRepository productRepo;
    private final UserRepository userRepo;
    private final CategoryRepository categoryRepo;
    private final LowStockProducer lowStockProducer;

    public ProductController(ProductRepository productRepo, UserRepository userRepo,
            CategoryRepository categoryRepo, LowStockProducer lowStockProducer) {
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.categoryRepo = categoryRepo;
        this.lowStockProducer = lowStockProducer;
    }

    @QueryMapping
    @Cacheable("products")
    public List<Product> getProducts() {
        return productRepo.findAll();
    }

    @QueryMapping
    public Optional<Product> getProduct(@Argument UUID id) {
        return productRepo.findById(id);
    }

    @QueryMapping
    public List<Product> getProductsByCategory(@Argument UUID categoryId) {
        return productRepo.findByCategoryId(categoryId);
    }

    @QueryMapping
    public List<Product> searchProducts(@Argument String keyword) {
        return productRepo.searchByKeyword(keyword);
    }

    @QueryMapping
    @Cacheable("categories")
    public List<Category> getCategories() {
        return categoryRepo.findAll();
    }

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Cacheable("analytics")
    public Analytics getAnalytics() {
        List<Product> all = productRepo.findAll();
        int total = all.size();
        double stockValue = all.stream().mapToDouble(p -> p.getPrice() * p.getQuantity()).sum();
        int lowStock = productRepo.findByQuantityLessThan(10).size();
        int categories = productRepo.countDistinctCategories();
        return new Analytics(total, stockValue, lowStock, categories);
    }

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getUsers() {
        return userRepo.findAll();
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Product addProduct(@Argument String name, @Argument UUID categoryId,
            @Argument Double price, @Argument Integer quantity) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepo.findByUsername(auth.getName()).orElseThrow();
        Category category = categoryRepo.findById(categoryId).orElseThrow();
        Product saved = productRepo.save(new Product(name, price, quantity, category, currentUser));

        if (saved.getQuantity() < 10) {
            lowStockProducer.sendLowStockAlert(
                    new LowStockEvent(saved.getId(), saved.getName(), saved.getQuantity()));
        }
        return saved;
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @CacheEvict(value = {"products", "analytics"}, allEntries = true)
    public Product updateProduct(@Argument UUID id, @Argument String name,
            @Argument UUID categoryId, @Argument Double price,
            @Argument Integer quantity) {
        Product p = productRepo.findById(id).orElseThrow();
        if (name != null)
            p.setName(name);
        if (categoryId != null) {
            Category category = categoryRepo.findById(categoryId).orElseThrow();
            p.setCategory(category);
        }
        if (price != null)
            p.setPrice(price);
        if (quantity != null)
            p.setQuantity(quantity);

        Product saved = productRepo.save(p);

        // Fire low stock event if quantity drops below 10
        if (saved.getQuantity() < 10) {
            lowStockProducer.sendLowStockAlert(
                    new LowStockEvent(saved.getId(), saved.getName(), saved.getQuantity()));
        }

        return saved;
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    @CacheEvict(value = {"products", "analytics"}, allEntries = true)
    public Boolean deleteProduct(@Argument UUID id) {
        productRepo.deleteById(id);
        return true;
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Boolean deleteUser(@Argument UUID id) {
        userRepo.deleteById(id);
        return true;
    }

    
}