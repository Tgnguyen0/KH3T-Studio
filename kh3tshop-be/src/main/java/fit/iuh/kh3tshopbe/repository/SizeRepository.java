package fit.iuh.kh3tshopbe.repository;

import fit.iuh.kh3tshopbe.entities.Size;
import fit.iuh.kh3tshopbe.enums.SizeName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SizeRepository extends JpaRepository<Size, Integer> {
    Optional<Size> findByNameSize(SizeName nameSize);
}