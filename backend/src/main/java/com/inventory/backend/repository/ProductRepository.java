package com.inventory.backend.repository;

import com.inventory.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    List<Product> findByCategoryId(UUID categoryId);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.category.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchByKeyword(String keyword);

    @Query("SELECT COUNT(DISTINCT p.category) FROM Product p")
    int countDistinctCategories();

    List<Product> findByQuantityLessThan(int quantity);

    List<Product> findByCreatedById(UUID userId);
}