package fit.iuh.kh3tshopbe.repository;

import fit.iuh.kh3tshopbe.entities.Cart;
import fit.iuh.kh3tshopbe.entities.CartDetail;
import fit.iuh.kh3tshopbe.entities.Product;


import fit.iuh.kh3tshopbe.entities.SizeDetail;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CartDetailRepository extends JpaRepository<CartDetail, Integer> {
    List<CartDetail> findByCart(Cart cart);
    CartDetail findByCartAndProduct(Cart cart, Product product);
    CartDetail findByCartAndProductAndSizeDetail(Cart cart, Product product, SizeDetail sizeDetail);
    List<CartDetail> findByIsSelectedAndCart(boolean isSelected, Cart cart);
}
