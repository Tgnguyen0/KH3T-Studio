package fit.iuh.kh3tshopbe.repository;

import fit.iuh.kh3tshopbe.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    Optional<Category> findByName(String name);

    @Query("""
    SELECT c.name AS categoryName,
           COUNT(p.id) AS productCount,
           SUM(i.totalAmount) AS revenue
    FROM Invoice i
    JOIN i.order o
    JOIN o.orderDetails od
    JOIN od.product p
    JOIN p.category c
    WHERE i.paymentStatus = 'PAID'
    GROUP BY c.id, c.name
    ORDER BY revenue DESC
    """)
    List<Object[]> getRevenueByCategory();
}
