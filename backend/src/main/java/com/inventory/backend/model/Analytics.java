package com.inventory.backend.model;

import java.io.Serializable;

public class Analytics implements Serializable {
    private int totalProducts;
    private double totalStockValue;
    private int lowStockCount;
    private int categoryCount;

    public Analytics(int totalProducts, double totalStockValue, int lowStockCount, int categoryCount) {
        this.totalProducts = totalProducts;
        this.totalStockValue = totalStockValue;
        this.lowStockCount = lowStockCount;
        this.categoryCount = categoryCount;
    }

    public int getTotalProducts() { return totalProducts; }
    public double getTotalStockValue() { return totalStockValue; }
    public int getLowStockCount() { return lowStockCount; }
    public int getCategoryCount() { return categoryCount; }
}