package fit.iuh.kh3tshopbe.controller;

import fit.iuh.kh3tshopbe.dto.request.SePayRequest;
import fit.iuh.kh3tshopbe.dto.response.SePayResponse;
import fit.iuh.kh3tshopbe.service.SePayService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SePayController {

    SePayService sePayService;

    @PostMapping("/sepay-callback")
    public ResponseEntity<SePayResponse> sePayCallback(
            @RequestBody SePayRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String apiKey = "KH3T_SHOP_KEY";

        if (authHeader != null && authHeader.startsWith("Apikey ")) {
            apiKey = authHeader.replace("Apikey ", "");
        }

        SePayResponse response = sePayService.handleCallback(request, apiKey);
        return ResponseEntity.ok(response);
    }
}
