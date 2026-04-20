package fit.iuh.kh3tshopbe.entities;

import fit.iuh.kh3tshopbe.enums.PaymentMethod;
import fit.iuh.kh3tshopbe.enums.StatusOrdering;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "orders")
@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString(exclude = {"orderDetails"})
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private int id;

    @Column(name = "order_code", nullable = false, unique = true)
    private String orderCode;

    @Column(name = "note")
    private String note;

    @Column(name = "order_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date orderDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_ordering")
    private StatusOrdering statusOrder;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "customer_trading_id")
    private CustomerTrading customerTrading;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<OrderDetail> orderDetails;

    @OneToOne(mappedBy = "order")
    private Invoice invoice;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;


    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;
}
