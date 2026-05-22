package fit.iuh.kredoshopbe.mapper;

import fit.iuh.kredoshopbe.dto.request.ProductRequest;
import fit.iuh.kredoshopbe.dto.response.ProductResponse;
import fit.iuh.kredoshopbe.entities.Product;
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
