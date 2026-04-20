package fit.iuh.kh3tshopbe.repository;

import fit.iuh.kh3tshopbe.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;



import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findByDiscountAmountGreaterThan(Double amount);
    @Query("SELECT COUNT(p) FROM Product p")
    long getTotalProducts();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.quantity <= :threshold")
    long getLowStockProducts(@Param("threshold") int threshold);


    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN FETCH p.sizeDetails sd " +
            "LEFT JOIN FETCH sd.size " +
            "LEFT JOIN FETCH p.category")
    List<Product> findAllWithDetails();

}