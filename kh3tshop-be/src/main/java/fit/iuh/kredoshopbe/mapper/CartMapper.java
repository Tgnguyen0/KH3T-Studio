package fit.iuh.kredoshopbe.mapper;

import fit.iuh.kredoshopbe.dto.response.CartResponse;
import fit.iuh.kredoshopbe.entities.Cart;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CartMapper {
    CartResponse toCartResponse(Cart cart);
}
