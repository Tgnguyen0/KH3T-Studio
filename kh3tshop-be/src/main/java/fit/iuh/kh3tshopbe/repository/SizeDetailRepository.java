package fit.iuh.kh3tshopbe.repository;

import fit.iuh.kh3tshopbe.entities.Product;
import fit.iuh.kh3tshopbe.entities.Size;
import fit.iuh.kh3tshopbe.entities.SizeDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SizeDetailRepository extends JpaRepository<SizeDetail, Integer> {


    SizeDetail findSizeDetailByProductAndSize(Product product, Size size);

}