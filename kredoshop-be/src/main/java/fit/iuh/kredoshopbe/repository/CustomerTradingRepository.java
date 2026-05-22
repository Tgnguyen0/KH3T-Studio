package fit.iuh.kredoshopbe.repository;

import fit.iuh.kredoshopbe.entities.CustomerTrading;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerTradingRepository extends JpaRepository<CustomerTrading, Integer> {
    @Query("""
        SELECT c.receiverAddress, 
               COUNT(c.id) AS orders,
               SUM(c.totalAmount) AS revenue
        FROM CustomerTrading c
        GROUP BY c.receiverAddress
    """)
    List<Object[]> getRegionRawData();




}
