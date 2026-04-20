package fit.iuh.kh3tshopbe.controller;

import fit.iuh.kh3tshopbe.dto.request.CartDetailRequest;
import fit.iuh.kh3tshopbe.dto.response.CartDetailResponse;
import fit.iuh.kh3tshopbe.entities.CartDetail;
import fit.iuh.kh3tshopbe.service.CartDetailService;
import jakarta.websocket.server.PathParam;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart-details")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartDetailController {
    CartDetailService cartDetailService;

    @PostMapping("/add-to-cart")
    public CartDetailResponse addToCartDetail(@RequestBody CartDetailRequest cartDetailRequest){
       return cartDetailService.addCartDetail(cartDetailRequest);
    }

    @GetMapping("/cart/{cartId}")
    public List<CartDetailResponse> getCartDetails(@PathVariable int cartId){
        return cartDetailService.getCartDetailListByCardId(cartId);
    }
    @GetMapping("/cart/{cartId}/selected")
    public List<CartDetailResponse> getCartDetailsIsSelected(@PathVariable int cartId){
        return cartDetailService.getCartDetailIsSelected(cartId);
    }

    @PutMapping("/{cartDetailId}/select")
    public ResponseEntity<CartDetailResponse> updateSelected(
            @PathVariable int cartDetailId,
            @RequestBody Map<String, Boolean> body) {
        boolean selected = body.get("selected");
        CartDetailResponse response = cartDetailService.updateCartDetailSelected(cartDetailId, selected);
        return ResponseEntity.ok(response);
    }
    @PutMapping("/{cartDetailId}/increase-quantity")
    public ResponseEntity<CartDetailResponse> increaseQuantity(
            @PathVariable int cartDetailId) {
        CartDetailResponse response = cartDetailService.updateCartDetailIncreaseQuantity(cartDetailId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{cartDetailId}/decrease-quantity")
    public ResponseEntity<CartDetailResponse> decreaseQuantity(
            @PathVariable int cartDetailId) {
        CartDetailResponse response = cartDetailService.updateCartDetailDecreaseQuantity(cartDetailId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{cartDetailId}")
    public ResponseEntity<Void> deleteCartDetail(@PathVariable int cartDetailId){
        cartDetailService.deleteCartDetail(cartDetailId);
        return ResponseEntity.ok().build();
    }

}
