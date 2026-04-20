// src/main/java/fit/iuh/kh3tshopbe/service/WishListService.java
package fit.iuh.kh3tshopbe.service;

import fit.iuh.kh3tshopbe.dto.response.WishListResponse;
import fit.iuh.kh3tshopbe.entities.Account;
import fit.iuh.kh3tshopbe.entities.WishList;
import fit.iuh.kh3tshopbe.repository.AccountRepository;
import fit.iuh.kh3tshopbe.repository.WishListRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WishListService {

    WishListRepository wishlistRepository;
    AccountRepository accountRepository;

    // ==================== CREATE ====================
    public WishListResponse createWishlist(WishList wishlist, String username) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        wishlist.setAccount(account);
        wishlist.setCreated_at(new Date());
        wishlist.setUpdated_at(new Date());

        WishList saved = wishlistRepository.save(wishlist);
        return toResponse(saved);
    }

    // ==================== READ (ALL BY USER) ====================
    public List<WishListResponse> getWishlistsByCurrentUser(String username) {
        return wishlistRepository.findByAccount_Username(username).stream()
                .map(this::toResponse)
                .toList();
    }

    // ==================== UPDATE ====================
    public WishListResponse updateWishlist(Integer id, WishList updated, String username) {
        WishList existing = wishlistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wishlist not found"));

        // Kiểm tra quyền sở hữu
        if (!existing.getAccount().getUsername().equals(username)) {
            throw new RuntimeException("Bạn không có quyền sửa wishlist này");
        }

        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setUpdated_at(new Date());

        WishList saved = wishlistRepository.save(existing);
        return toResponse(saved);
    }

    // ==================== DELETE ====================
    public void deleteWishlist(Integer id, String username) {
        WishList wishlist = wishlistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wishlist not found"));

        // Kiểm tra quyền sở hữu
        if (!wishlist.getAccount().getUsername().equals(username)) {
            throw new RuntimeException("Bạn không có quyền xóa wishlist này");
        }

        wishlistRepository.delete(wishlist);
    }



    // ==================== HELPER: Entity → DTO ====================
    private WishListResponse toResponse(WishList w) {
        return WishListResponse.builder()
                .id(w.getId())
                .name(w.getName())
                .description(w.getDescription())
                .created_at(w.getCreated_at())
                .updated_at(w.getUpdated_at())
                .username(w.getAccount().getUsername())
                .itemCount(w.getDetails() != null ? w.getDetails().size() : 0)
                .build();
    }
}