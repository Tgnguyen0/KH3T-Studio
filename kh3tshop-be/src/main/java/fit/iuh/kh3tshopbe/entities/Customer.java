package fit.iuh.kh3tshopbe.entities;

import fit.iuh.kh3tshopbe.enums.Gender;
import fit.iuh.kh3tshopbe.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;

@Entity
@Table(name = "customer")
@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private int id;
    @Column(name = "full_name")
    private String fullName;
    @Column(name = "phone_number")
    private String phoneNumber;
    @Column(name = "email")
    private String email;
    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;
    @Column(name = "date_of_birth")
    private Date dateOfBirth;
    @Column(name = "create_at")
    @Temporal(TemporalType.DATE)
    private Date createAt;
    @Column(name = "update_at")
    @Temporal(TemporalType.DATE)
    private Date updateAt;
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @OneToOne(mappedBy = "customer")
    @ToString.Exclude
    private Account account;
}
