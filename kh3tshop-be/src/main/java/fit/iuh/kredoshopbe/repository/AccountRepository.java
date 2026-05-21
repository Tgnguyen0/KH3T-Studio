package fit.iuh.kredoshopbe.repository;
import fit.iuh.kredoshopbe.entities.Account;

import fit.iuh.kredoshopbe.enums.Role;

import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;


import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    boolean existsByUsername(String username);

    Optional<Account> findByUsername(String username);

    Optional<Account> findByCustomer_Email(String email);

    List<Account> findByRole(Role role);


}
