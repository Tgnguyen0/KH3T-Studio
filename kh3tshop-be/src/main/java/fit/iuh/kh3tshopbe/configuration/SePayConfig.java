package fit.iuh.kh3tshopbe.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SePayConfig {

    @Value("${sepay.api-key}")
    private String apiKey;

    public String getApiKey() {
        return apiKey;
    }
}
