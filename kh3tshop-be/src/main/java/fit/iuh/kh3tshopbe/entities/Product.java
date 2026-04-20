package fit.iuh.kh3tshopbe.entities;

import fit.iuh.kh3tshopbe.enums.Status;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "product")
@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private int id;

    @Column(name = "product_name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "price")
    private double price;

    @Column(name = "cost_price")
    private double costPrice;

    @Column(name = "unit")
    private String unit;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "image_url_front")
    private String imageUrlFront;

    @Column(name = "image_url_back")
    private String imageUrlBack;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @Column(name = "brand")
    private String brand;

    @Column(name = "rating")
    private double rating;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category")
    private Category category;

    @Column(name = "discount_amount")
    private double discountAmount;
    // THÊM 2 THUỘC TÍNH MỚI
    @Column(name = "material")
    private String material;

    @Column(name = "form")
    private String form;

    @Enumerated(EnumType.STRING)
    private Status status;
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<OrderDetail> orderDetails;

    @OneToMany(mappedBy = "product")
    private List<WishListDetail> details;

    @OneToMany(mappedBy = "product")
    private List<CartDetail> cartDetails;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<SizeDetail> sizeDetails;
}