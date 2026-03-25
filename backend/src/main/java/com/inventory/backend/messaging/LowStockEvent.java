package com.inventory.backend.messaging;

import java.util.UUID;

public class LowStockEvent {
    private UUID productId;
    private String productName;
    private int quantity;

    public LowStockEvent() {}

    public LowStockEvent(UUID productId, String productName, int quantity) {
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
    }

    public UUID getProductId() { return productId; }
    public String getProductName() { return productName; }
    public int getQuantity() { return quantity; }

    public void setProductId(UUID productId) { this.productId = productId; }
    public void setProductName(String productName) { this.productName = productName; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}