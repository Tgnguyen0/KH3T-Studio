package fit.iuh.kredoshopbe.mapper;

import fit.iuh.kredoshopbe.dto.response.CustomerTradingResponse;
import fit.iuh.kredoshopbe.entities.CustomerTrading;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CustomerTradingMapper {
    CustomerTradingResponse toCustomerTradingMapper(CustomerTrading customerTrading);
}
