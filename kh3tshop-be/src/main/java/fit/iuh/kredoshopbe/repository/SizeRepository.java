package fit.iuh.kredoshopbe.repository;

import fit.iuh.kredoshopbe.entities.Size;
import fit.iuh.kredoshopbe.enums.SizeName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SizeRepository extends JpaRepository<Size, Integer> {
    Optional<Size> findByNameSize(SizeName nameSize);
}