package fit.iuh.kredoshopbe.mapper;

import fit.iuh.kredoshopbe.dto.response.OrderDetailResponse;
import fit.iuh.kredoshopbe.entities.OrderDetail;
import org.mapstruct.Mapper;

import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderDetailMapper {
    @Mapping(target = "orderId", expression = "java(orderDetail.getOrder() != null ? orderDetail.getOrder().getId() : 0)")
    @Mapping(target = "productId", expression = "java(orderDetail.getProduct() != null ? orderDetail.getProduct().getId() : 0)")
    OrderDetailResponse toOrderDetailResponse(OrderDetail orderDetail);
}
