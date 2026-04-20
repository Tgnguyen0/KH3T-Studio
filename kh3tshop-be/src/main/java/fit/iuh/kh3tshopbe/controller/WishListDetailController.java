package fit.iuh.kh3tshopbe.controller;// src/main/java/fit/iuh/kh3tshopbe/controller/WishlistDetailController.java

import fit.iuh.kh3tshopbe.dto.request.AddItemRequest;
import fit.iuh.kh3tshopbe.dto.response.ApiResponse;
import fit.iuh.kh3tshopbe.dto.response.WishListDetailResponse;
import fit.iuh.kh3tshopbe.service.WishListDetailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlists")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin(origins = "http://localhost:5173")
public class WishListDetailController {

    WishListDetailService detailService;

    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : null;
    }

    // 1. THÊM SẢN PHẨM VÀO WISHLIST
    @PostMapping("/{wishlistId}/items")
    public ApiResponse<Void> addItemToWishlist(
            @PathVariable Integer wishlistId,
            @RequestBody AddItemRequest request) {

        String username = getCurrentUsername();
        if (username == null) {
            return ApiResponse.<Void>builder().code(401).message("Unauthorized").build();
        }

        detailService.addItem(wishlistId, request.productId(), username);
        return ApiResponse.<Void>builder().message("Đã thêm vào wishlist").build();
    }

    // 2. XÓA SẢN PHẨM KHỎI WISHLIST
    @DeleteMapping("/{wishlistId}/items/{productId}")
    public ApiResponse<Void> removeItemFromWishlist(
            @PathVariable Integer wishlistId,
            @PathVariable Integer productId) {

        String username = getCurrentUsername();
        if (username == null) {
            return ApiResponse.<Void>builder()
                    .code(401)
                    .message("Unauthorized")
                    .build();
        }

        detailService.removeItem(wishlistId, productId, username);
        return ApiResponse.<Void>builder()
                .message("Xóa sản phẩm khỏi wishlist thành công")
                .build();
    }
    @GetMapping("/{wishlistId}/items")
    public ApiResponse<List<WishListDetailResponse>> getWishlistItems(
            @PathVariable Integer wishlistId) {

        String username = getCurrentUsername();
        if (username == null) {
            return ApiResponse.<List<WishListDetailResponse>>builder()
                    .code(401)
                    .message("Unauthorized")
                    .build();
        }
        List<WishListDetailResponse> items = detailService.getItemsByWishlistId(wishlistId, username);
        return ApiResponse.<List<WishListDetailResponse>>builder()
                .result(items)
                .build();
    }
}

