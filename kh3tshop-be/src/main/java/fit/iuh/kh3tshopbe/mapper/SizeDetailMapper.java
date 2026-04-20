package fit.iuh.kh3tshopbe.mapper;

import fit.iuh.kh3tshopbe.dto.response.OrderResponse;
import fit.iuh.kh3tshopbe.dto.response.SizeDetailResponse;
import fit.iuh.kh3tshopbe.entities.Order;
import fit.iuh.kh3tshopbe.entities.SizeDetail;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SizeDetailMapper {
    SizeDetailResponse toSizeDetailMapper(SizeDetail sizeDetail);
}
