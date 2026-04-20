package fit.iuh.kh3tshopbe.repository;

import fit.iuh.kh3tshopbe.entities.Account;
import fit.iuh.kh3tshopbe.entities.Cart;
import fit.iuh.kh3tshopbe.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    Cart findByAccount(Account account);

}
