package fit.iuh.kredoshopbe.repository;

import fit.iuh.kredoshopbe.entities.Size;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SizeRepository extends JpaRepository<Size, Integer> {
    Optional<Size> findByNameSize(String nameSize);
}