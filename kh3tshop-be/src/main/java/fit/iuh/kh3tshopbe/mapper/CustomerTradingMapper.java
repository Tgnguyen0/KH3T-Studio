package fit.iuh.kh3tshopbe.mapper;

import fit.iuh.kh3tshopbe.dto.response.CartDetailResponse;
import fit.iuh.kh3tshopbe.dto.response.CustomerTradingResponse;
import fit.iuh.kh3tshopbe.entities.CartDetail;
import fit.iuh.kh3tshopbe.entities.CustomerTrading;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CustomerTradingMapper {
    CustomerTradingResponse toCustomerTradingMapper(CustomerTrading customerTrading);
}
