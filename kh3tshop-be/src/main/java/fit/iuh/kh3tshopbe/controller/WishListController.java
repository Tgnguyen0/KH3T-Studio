// src/main/java/fit/iuh/kh3tshopbe/controller/WishListController.java
package fit.iuh.kh3tshopbe.controller;

import fit.iuh.kh3tshopbe.dto.response.ApiResponse;
import fit.iuh.kh3tshopbe.dto.response.WishListResponse;
import fit.iuh.kh3tshopbe.entities.WishList;
import fit.iuh.kh3tshopbe.repository.WishListRepository;
import fit.iuh.kh3tshopbe.service.WishListService;
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
public class WishListController {

    WishListService wishlistService;
    private final WishListRepository wishListRepository;
    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : null;
    }

    // GET: Danh sách wishlist
    @GetMapping
    public ApiResponse<List<WishListResponse>> getMyWishlists() {
        String username = getCurrentUsername();
        if (username == null) {
            return ApiResponse.<List<WishListResponse>>builder()
                    .code(401)
                    .message("Unauthorized")
                    .build();
        }
        List<WishListResponse> wishlists = wishlistService.getWishlistsByCurrentUser(username);
        return ApiResponse.<List<WishListResponse>>builder()
                .result(wishlists)
                .build();
    }

    // POST: Tạo mới
    @PostMapping
    public ApiResponse<WishListResponse> createWishlist(@RequestBody WishList wishlist) {
        String username = getCurrentUsername();
        if (username == null) {
            return ApiResponse.<WishListResponse>builder()
                    .code(401)
                    .message("Unauthorized")
                    .build();
        }
        if (wishlist.getName() == null || wishlist.getName().trim().isEmpty()) {
            return ApiResponse.<WishListResponse>builder()
                    .code(400)
                    .message("Tên wishlist không được để trống")
                    .build();
        }

        WishListResponse created = wishlistService.createWishlist(wishlist, username);
        return ApiResponse.<WishListResponse>builder()
                .result(created)
                .build();
    }

    // PUT: Sửa
    @PutMapping("/{id}")
    public ApiResponse<WishListResponse> updateWishlist(
            @PathVariable Integer id,
            @RequestBody WishList wishlist) {
        String username = getCurrentUsername();
        if (username == null) {
            return ApiResponse.<WishListResponse>builder()
                    .code(401)
                    .message("Unauthorized")
                    .build();
        }
        WishListResponse updated = wishlistService.updateWishlist(id, wishlist, username);
        return ApiResponse.<WishListResponse>builder()
                .result(updated)
                .build();
    }

    // DELETE: Xóa
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteWishlist(@PathVariable Integer id) {
        String username = getCurrentUsername();
        if (username == null) {
            return ApiResponse.<Void>builder()
                    .code(401)
                    .message("Unauthorized")
                    .build();
        }
        wishlistService.deleteWishlist(id, username);
        return ApiResponse.<Void>builder()
                .message("Xóa wishlist thành công")
                .build();
    }

    //show list sp da thich

    @GetMapping("/products/{productId}/in-wishlist")
    public ApiResponse<Boolean> isProductInWishlist(
            @PathVariable Integer productId,
            Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ApiResponse.<Boolean>builder()
                    .result(false)
                    .build();
        }
        String username = authentication.getName();
        // Dùng repository đã được inject từ @RequiredArgsConstructor
        boolean exists = wishListRepository.existsByAccount_UsernameAndDetails_Product_Id(username, productId);
        return ApiResponse.<Boolean>builder()
                .result(exists)
                .build();
    }
}