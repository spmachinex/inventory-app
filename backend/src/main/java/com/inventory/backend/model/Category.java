package com.inventory.backend.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "categories")
public class Category implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String name;

    public Category() {}

    public Category(String name) {
        this.name = name;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public void setId(UUID id) { this.id = id; }
    public void setName(String name) { this.name = name; }
}