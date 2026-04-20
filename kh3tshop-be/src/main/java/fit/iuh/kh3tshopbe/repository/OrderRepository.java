package fit.iuh.kh3tshopbe.repository;

import fit.iuh.kh3tshopbe.entities.Account;
import fit.iuh.kh3tshopbe.entities.Order;
import fit.iuh.kh3tshopbe.enums.StatusOrdering;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;


public interface OrderRepository extends JpaRepository<Order, Integer> {
    int countOrderByOrderDate(Date date);
    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderDate BETWEEN :start AND :end")
    int countOrderByOrderDateBetween(@Param("start") Date start, @Param("end") Date end);


    @Query("""
        SELECT o.orderCode,
               c.receiverName,
               i.totalAmount,
               i.paymentMethod,
               o.statusOrder,
               o.orderDate,
               SIZE(o.orderDetails)
        FROM Order o
        JOIN o.customerTrading c
        JOIN o.invoice i
    """)
    List<Object[]> getDetailedOrders();

    List<Order> findByOrderDateBetween(LocalDateTime start, LocalDateTime end);

    long countByStatusOrder(StatusOrdering statusOrder);


    List<Order> findByAccount(Account account);


}
