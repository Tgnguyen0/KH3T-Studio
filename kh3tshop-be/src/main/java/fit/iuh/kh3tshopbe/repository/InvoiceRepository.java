package fit.iuh.kh3tshopbe.repository;

import fit.iuh.kh3tshopbe.entities.Invoice;

import fit.iuh.kh3tshopbe.enums.StatusPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.List;
import java.util.Optional;


public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);





    // Profit theo tuần (year + week)
    @Query("SELECT YEAR(i.createdAt) as year, WEEK(i.createdAt) as week, SUM(i.totalAmount) as profit " +
            "FROM Invoice i " +
            "WHERE i.paymentStatus = 'PAID' AND i.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY YEAR(i.createdAt), WEEK(i.createdAt) " +
            "ORDER BY YEAR(i.createdAt), WEEK(i.createdAt)")
    List<Object[]> getProfitByWeek(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    // Profit theo tháng (year + month)
    @Query("SELECT YEAR(i.createdAt) as year, MONTH(i.createdAt) as month, SUM(i.totalAmount) as profit " +
            "FROM Invoice i " +
            "WHERE i.paymentStatus = 'PAID' AND i.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY YEAR(i.createdAt), MONTH(i.createdAt) " +
            "ORDER BY YEAR(i.createdAt), MONTH(i.createdAt)")
    List<Object[]> getProfitByMonth(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    // Profit theo năm
    @Query("SELECT YEAR(i.createdAt) as year, SUM(i.totalAmount) as profit " +
            "FROM Invoice i " +
            "WHERE i.paymentStatus = 'PAID' AND i.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY YEAR(i.createdAt) " +
            "ORDER BY YEAR(i.createdAt)")
    List<Object[]> getProfitByYear(@Param("startDate") Date startDate, @Param("endDate") Date endDate);


    @Query("""
        SELECT i.paymentMethod AS method,
               COUNT(i.id) AS countInvoice,
               SUM(i.totalAmount) AS totalRevenue
        FROM Invoice i
        GROUP BY i.paymentMethod
    """)
    List<Object[]> getPaymentStatistics();


    @Query("SELECT DATE(i.createdAt) as date, SUM(i.totalAmount) as revenue, COUNT(i) as orderCount " +
            "FROM Invoice i " +
            "WHERE i.paymentStatus = :status " +
            "AND i.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY DATE(i.createdAt) " +
            "ORDER BY DATE(i.createdAt)")
    List<Object[]> findDailyRevenue(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") StatusPayment status
    );

    // Lấy doanh thu theo tuần
    @Query("SELECT YEAR(i.createdAt) as year, WEEK(i.createdAt) as week, " +
            "SUM(i.totalAmount) as revenue, COUNT(i) as orderCount " +
            "FROM Invoice i " +
            "WHERE i.paymentStatus = :status " +
            "AND i.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY YEAR(i.createdAt), WEEK(i.createdAt) " +
            "ORDER BY YEAR(i.createdAt), WEEK(i.createdAt)")
    List<Object[]> findWeeklyRevenue(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") StatusPayment status
    );

    // Lấy doanh thu theo tháng
    @Query("SELECT YEAR(i.createdAt) as year, MONTH(i.createdAt) as month, " +
            "SUM(i.totalAmount) as revenue, COUNT(i) as orderCount " +
            "FROM Invoice i " +
            "WHERE i.paymentStatus = :status " +
            "AND i.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY YEAR(i.createdAt), MONTH(i.createdAt) " +
            "ORDER BY YEAR(i.createdAt), MONTH(i.createdAt)")
    List<Object[]> findMonthlyRevenue(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") StatusPayment status
    );

    // Lấy doanh thu theo ngày trong tuần (phân tích mùa vụ)
    @Query("SELECT DAYOFWEEK(i.createdAt) as dayOfWeek, " +
            "AVG(i.totalAmount) as avgRevenue, " +
            "SUM(i.totalAmount) as totalRevenue, " +
            "COUNT(i) as orderCount " +
            "FROM Invoice i " +
            "WHERE i.paymentStatus = :status " +
            "AND i.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY DAYOFWEEK(i.createdAt) " +
            "ORDER BY DAYOFWEEK(i.createdAt)")
    List<Object[]> findRevenueByDayOfWeek(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") StatusPayment status
    );

    // Lấy doanh thu theo tháng trong năm (phân tích mùa vụ)
    @Query("SELECT MONTH(i.createdAt) as month, " +
            "AVG(i.totalAmount) as avgRevenue, " +
            "SUM(i.totalAmount) as totalRevenue, " +
            "COUNT(i) as orderCount " +
            "FROM Invoice i " +
            "WHERE i.paymentStatus = :status " +
            "AND i.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY MONTH(i.createdAt) " +
            "ORDER BY MONTH(i.createdAt)")
    List<Object[]> findRevenueByMonth(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") StatusPayment status
    );

    // Tổng doanh thu và số lượng đơn hàng
    @Query("SELECT SUM(i.totalAmount) as totalRevenue, COUNT(i) as totalOrders, " +
            "AVG(i.totalAmount) as avgOrderValue " +
            "FROM Invoice i " +
            "WHERE i.paymentStatus = :status " +
            "AND i.createdAt BETWEEN :startDate AND :endDate")
    Object[] findRevenueSummary(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") StatusPayment status
    );

    // Lấy invoice gần nhất để xác định ngày cuối cùng có dữ liệu
    @Query("SELECT MAX(i.createdAt) FROM Invoice i WHERE i.paymentStatus = :status")
    Date findLatestInvoiceDate(@Param("status") StatusPayment status);

    // Lấy invoice cũ nhất để xác định ngày đầu tiên có dữ liệu
    @Query("SELECT MIN(i.createdAt) FROM Invoice i WHERE i.paymentStatus = :status")
    Date findOldestInvoiceDate(@Param("status") StatusPayment status);

    // Kiểm tra có đủ dữ liệu không
    @Query(value = "SELECT COUNT(DISTINCT DATE(i.created_at)) " +
            "FROM invoice i " +
            "WHERE i.payment_status = :status " +
            "AND i.created_at BETWEEN :startDate AND :endDate",
            nativeQuery = true)
    Long countDistinctDays(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            @Param("status") String status  // Lưu ý: phải dùng String cho enum
    );

    Optional<Invoice> findById(int id);
    Invoice findByInvoiceCode(String invoiceCode);



}
