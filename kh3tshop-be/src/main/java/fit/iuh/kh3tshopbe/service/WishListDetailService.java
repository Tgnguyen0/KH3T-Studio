// src/main/java/fit/iuh/kh3tshopbe/service/WishlistDetailService.java
package fit.iuh.kh3tshopbe.service;

import fit.iuh.kh3tshopbe.dto.response.WishListDetailResponse;
import fit.iuh.kh3tshopbe.entities.Product;
import fit.iuh.kh3tshopbe.entities.WishList;
import fit.iuh.kh3tshopbe.entities.WishListDetail;

import fit.iuh.kh3tshopbe.repository.ProductRepository;

import fit.iuh.kh3tshopbe.repository.WishListDetailRepository;
import fit.iuh.kh3tshopbe.repository.WishListRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WishListDetailService {

    WishListDetailRepository detailRepository;
    WishListRepository wishlistRepository;
    ProductRepository productRepository;

    // XÓA SẢN PHẨM KHỎI WISHLIST
    @Transactional
    public void removeItem(Integer wishlistId, Integer productId, String username) {
        WishList wishlist = wishlistRepository.findById(wishlistId)
                .orElseThrow(() -> new RuntimeException("Wishlist not found"));

        if (!wishlist.getAccount().getUsername().equals(username)) {
            throw new RuntimeException("Không có quyền xóa");
        }

        if (!detailRepository.existsByWishlist_IdAndProduct_Id(wishlistId, productId)) {
            throw new RuntimeException("Sản phẩm không có trong wishlist");
        }

        detailRepository.deleteByWishlist_IdAndProduct_Id(wishlistId, productId);
    }
    public List<WishListDetailResponse> getItemsByWishlistId(Integer wishlistId, String username) {
        WishList wishlist = wishlistRepository.findById(wishlistId)
                .orElseThrow(() -> new RuntimeException("Wishlist not found"));

        if (!wishlist.getAccount().getUsername().equals(username)) {
            throw new RuntimeException("Không có quyền truy cập wishlist này");
        }

        return detailRepository.findByWishlist_Id(wishlistId).stream()
                .map(this::toResponse)
                .toList();
    }
    // WishListDetailService.java

    @Transactional
    public void addItem(Integer wishlistId, Integer productId, String username) {
        WishList wishlist = wishlistRepository.findById(wishlistId)
                .orElseThrow(() -> new RuntimeException("Wishlist không tồn tại"));

        if (!wishlist.getAccount().getUsername().equals(username)) {
            throw new RuntimeException("Bạn không có quyền thêm vào wishlist này");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        // Kiểm tra đã tồn tại chưa → tránh trùng
        boolean exists = detailRepository.existsByWishlist_IdAndProduct_Id(wishlistId, productId);
        if (exists) {
            throw new RuntimeException("Sản phẩm đã có trong wishlist");
        }

        WishListDetail detail = new WishListDetail();
        detail.setWishlist(wishlist);
        detail.setProduct(product);
        detail.setCreated_at(new Date());
        detail.setNote("");

        detailRepository.save(detail);
    }
    private WishListDetailResponse toResponse(WishListDetail d) {
        Product p = d.getProduct();
        return WishListDetailResponse.builder()
                .id(d.getId())
                .note(d.getNote())
                .created_at(d.getCreated_at())
                .wishlistId(d.getWishlist().getId())
                .productId(p.getId())
                .productName(p.getName())
                .productImage(p.getImageUrlFront())
                .productPrice(p.getPrice())
                .discountAmount((int) p.getDiscountAmount())
                .build();
    }

}