package fit.iuh.kredoshopbe.controller;

import fit.iuh.kredoshopbe.dto.request.SePayRequest;
import fit.iuh.kredoshopbe.dto.response.SePayResponse;
import fit.iuh.kredoshopbe.service.SePayService;
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
        System.out.println("[SePay Webhook] Nhận được callback request: " + request);
        System.out.println("[SePay Webhook] Authorization header: " + authHeader);

        String apiKey = "KH3T_SHOP_KEY";

        if (authHeader != null && authHeader.startsWith("Apikey ")) {
            apiKey = authHeader.replace("Apikey ", "");
        }

        SePayResponse response = sePayService.handleCallback(request, apiKey);
        System.out.println("[SePay Webhook] Kết quả xử lý: success=" + response.isSuccess() + ", message=" + response.getMessage());
        return ResponseEntity.ok(response);
    }
}
