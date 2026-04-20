package fit.iuh.kh3tshopbe.repository;

import fit.iuh.kh3tshopbe.entities.WishListDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishListDetailRepository extends JpaRepository<WishListDetail, Integer> {
    List<WishListDetail> findByWishlist_Id(Integer wishlistId);


    boolean existsByWishlist_IdAndProduct_Id(Integer wishlistId, Integer productId);

    void deleteByWishlist_IdAndProduct_Id(Integer wishlistId, Integer productId);
}
