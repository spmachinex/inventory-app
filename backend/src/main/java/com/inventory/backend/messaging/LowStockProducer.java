package com.inventory.backend.messaging;

import com.inventory.backend.config.RabbitMQConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class LowStockProducer {

    private final RabbitTemplate rabbitTemplate;

    public LowStockProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendLowStockAlert(LowStockEvent event) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.LOW_STOCK_EXCHANGE,
                RabbitMQConfig.LOW_STOCK_ROUTING_KEY,
                event
        );
        System.out.println("Low stock alert sent for: " + event.getProductName());
    }
}