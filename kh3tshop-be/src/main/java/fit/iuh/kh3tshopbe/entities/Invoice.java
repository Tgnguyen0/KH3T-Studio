
package fit.iuh.kh3tshopbe.entities;

import fit.iuh.kh3tshopbe.enums.PaymentMethod;
import fit.iuh.kh3tshopbe.enums.StatusPayment;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import java.util.Date;

@Entity
@Table(name = "invoice")
@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString(exclude = {"order"})
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_id")
    private int id;

    @Column(name = "invoice_code", nullable = false, unique = true)
    private String invoiceCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private StatusPayment paymentStatus;

    @Column(name = "subtotal_amount")
    private double subtotalAmount;


    @Column(name = "tax_amount")
    private double taxAmount;

    @Column(name = "total_amount")
    private double totalAmount;



    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
}

