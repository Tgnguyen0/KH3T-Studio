package fit.iuh.kredoshopbe.mapper;

import fit.iuh.kredoshopbe.dto.response.OrderResponse;
import fit.iuh.kredoshopbe.entities.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {OrderDetailMapper.class})
public interface OrderMapper {
    @Mapping(source = "paymentMethod", target = "paymentMethod")
    @Mapping(source = "orderDetails", target = "orderDetails")
    OrderResponse toOrderMapper(Order order);
}
