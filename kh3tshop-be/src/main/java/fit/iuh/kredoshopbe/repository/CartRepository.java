package fit.iuh.kredoshopbe.repository;

import fit.iuh.kredoshopbe.entities.Account;
import fit.iuh.kredoshopbe.entities.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    Cart findByAccount(Account account);

}
