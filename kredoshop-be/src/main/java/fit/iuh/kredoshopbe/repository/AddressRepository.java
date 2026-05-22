package fit.iuh.kredoshopbe.repository;

import fit.iuh.kredoshopbe.entities.Account;
import fit.iuh.kredoshopbe.entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByAccount(Account account);
}
