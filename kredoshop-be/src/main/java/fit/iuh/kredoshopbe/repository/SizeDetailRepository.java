package fit.iuh.kredoshopbe.repository;

import fit.iuh.kredoshopbe.entities.Product;
import fit.iuh.kredoshopbe.entities.Size;
import fit.iuh.kredoshopbe.entities.SizeDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SizeDetailRepository extends JpaRepository<SizeDetail, Integer> {


    SizeDetail findSizeDetailByProductAndSize(Product product, Size size);

}