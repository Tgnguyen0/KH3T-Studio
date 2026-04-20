package fit.iuh.kh3tshopbe.entities;

import fit.iuh.kh3tshopbe.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import java.util.Date;

@Entity
@Table(name = "customer_trading")
@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString(exclude = {"order"})
public class CustomerTrading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trading_id")
    private int id;

    @Column(name = "receiver_name", nullable = false)
    private String receiverName;

    @Column(name = "receiver_phone", nullable = false)
    private String receiverPhone;

    @Column(name = "receiver_email")
    private String receiverEmail;

    @Column(name = "receiver_address", nullable = false)
    private String receiverAddress;


    @Column(name = "total_amount")
    private double totalAmount;

    @Column(name = "trading_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date tradingDate;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @OneToOne(mappedBy = "customerTrading", fetch = FetchType.LAZY)
    private Order order;
}
