package com.inventory.backend.messaging;

import com.inventory.backend.config.RabbitMQConfig;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class LowStockConsumer {

    @RabbitListener(queues = RabbitMQConfig.LOW_STOCK_QUEUE)
    public void handleLowStockAlert(LowStockEvent event) {
        System.out.println("⚠ LOW STOCK ALERT:");
        System.out.println("  Product: " + event.getProductName());
        System.out.println("  ID: " + event.getProductId());
        System.out.println("  Quantity: " + event.getQuantity());
        // Here you could send an email, push notification, etc.
    }
}