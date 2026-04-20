package fit.iuh.kh3tshopbe.mapper;

import fit.iuh.kh3tshopbe.dto.request.ProductRequest;
import fit.iuh.kh3tshopbe.dto.response.ProductResponse;
import fit.iuh.kh3tshopbe.entities.Account;
import fit.iuh.kh3tshopbe.entities.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "category", source = "categoryRequest")
    @Mapping(target = "sizeDetails", source = "sizeDetailRequests")
    Product toProduct(ProductRequest productRequest);

    @Mapping(target = "category", source = "category")
    @Mapping(target = "sizeDetails", source = "sizeDetails")
    @Mapping(target = "status", source = "status")
    ProductResponse toProductResponse(Product product);
}
