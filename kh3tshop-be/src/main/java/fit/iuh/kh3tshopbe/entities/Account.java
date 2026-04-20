package fit.iuh.kh3tshopbe.entities;

import fit.iuh.kh3tshopbe.enums.Role;
import fit.iuh.kh3tshopbe.enums.StatusLogin;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "account")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Account {
    @Id
    @Column(name = "login_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "customer_id")
    @ToString.Exclude
    Customer customer;
    @Column(name = "username")
    String username;
    @Column(name = "password")
    String password;
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    Role role;
    @Column(name = "create_at")
    Date createAt;
    @Column(name = "update_at")
    Date updateAt;
    @Enumerated(EnumType.STRING)
    @Column(name = "status_login")
    StatusLogin statusLogin;

    @OneToMany(mappedBy = "account")
    @ToString.Exclude
    private List<Address> addresses;


    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL)
    private Cart cart;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<WishList> wishLists;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Order> orders;
}
