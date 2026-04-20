package fit.iuh.kh3tshopbe.controller;


import fit.iuh.kh3tshopbe.dto.request.CartUpdateRequest;
import fit.iuh.kh3tshopbe.dto.request.CartRequest;
import fit.iuh.kh3tshopbe.dto.response.ApiResponse;
import fit.iuh.kh3tshopbe.dto.response.CartResponse;
import fit.iuh.kh3tshopbe.entities.Cart;
import fit.iuh.kh3tshopbe.service.CartService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/carts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartController {
    CartService cartService;

    @GetMapping("/account/{accountId}")
    public ApiResponse<CartResponse> getCartByAccountId(@PathVariable int accountId) {

        Cart cart = cartService.getCartByAccountId(accountId);

        CartResponse response = CartResponse.builder()
                .id(cart.getId())
                .totalQuantity(cart.getTotalQuantity())
                .totalAmount(cart.getTotalAmount())
                .build();

        ApiResponse<CartResponse> result = new ApiResponse<>();
        result.setResult(response);
        return result;
    }


    @PutMapping("/update/{cartId}")
    public ApiResponse<CartResponse> updateCart(@PathVariable int cartId, @RequestBody CartRequest cartRequest) {
        CartResponse updated = cartService.updateCart(cartId, cartRequest);
        return ApiResponse.<CartResponse>builder()
                .message("Cart updated")
                .result(updated)
                .build();
    }

    @PutMapping("/update/{cartId}/increase")
    public ApiResponse<CartResponse> updateCartIncrease(@PathVariable int cartId, @RequestBody CartUpdateRequest cartPriceRequest) {
        CartResponse cartResponse = cartService.updateCartIncrease(cartId, cartPriceRequest);
        return ApiResponse.<CartResponse>builder()
                .message("Cart updated")
                .result(cartResponse)
                .build();
    }

    @PutMapping("/update/{cartId}/decrease")
    public ApiResponse<CartResponse> updateCartDecrease(@PathVariable int cartId, @RequestBody CartUpdateRequest cartPriceRequest) {
        CartResponse cartResponse = cartService.updateCartDecrease(cartId, cartPriceRequest);
        return ApiResponse.<CartResponse>builder()
                .message("Cart updated")
                .result(cartResponse)
                .build();
    }

    @PutMapping("/update/{cartId}/delete")
    public ApiResponse<CartResponse> updateCartDelete(@PathVariable int cartId, @RequestBody CartUpdateRequest cartPriceRequest) {
        CartResponse cartResponse = cartService.updateCartDelete(cartId, cartPriceRequest);
        return ApiResponse.<CartResponse>builder()
                .message("Cart updated")
                .result(cartResponse)
                .build();
    }
}
