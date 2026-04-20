package fit.iuh.kh3tshopbe.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;

@Entity
@Table(name = "cart_detail")
@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
public class CartDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_detail_id")
    private int id;
    @Column(name = "quantity")
    private int quantity;
    @Column(name = "price_at_time")
    private double price_at_time;
    @Column(name = "subtotal")
    private double subtotal;
    @Column(name = "is_selected")
    private boolean isSelected;
    @Column(name = "create_at")
    @Temporal(TemporalType.DATE)
    private Date createAt;
    @Column(name = "update_at")
    @Temporal(TemporalType.DATE)
    private Date updateAt;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private Cart cart;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "size_detail_id")
    private SizeDetail sizeDetail;
}

