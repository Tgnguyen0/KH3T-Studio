package fit.iuh.kredoshopbe.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SePayConfig {

    @Value("${sepay.api-key}")
    private String apiKey;

    @Value("${sepay.webhook-token}")
    private String webhookToken;

    public String getApiKey() {
        return apiKey;
    }

    public String getWebhookToken() {
        return webhookToken;
    }
}
