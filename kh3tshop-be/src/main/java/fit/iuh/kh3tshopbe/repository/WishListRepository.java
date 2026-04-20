package fit.iuh.kh3tshopbe.repository;

import fit.iuh.kh3tshopbe.entities.WishList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishListRepository extends JpaRepository<WishList, Integer> {
    List<WishList> findByAccount_Username(String username);

    boolean existsByAccount_UsernameAndDetails_Product_Id(String username, Integer productId);

}
