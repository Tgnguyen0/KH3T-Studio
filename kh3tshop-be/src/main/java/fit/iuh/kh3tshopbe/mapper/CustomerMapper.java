package fit.iuh.kh3tshopbe.mapper;

import fit.iuh.kh3tshopbe.dto.request.AccountRequest;
import fit.iuh.kh3tshopbe.dto.request.CustomerRequest;
import fit.iuh.kh3tshopbe.dto.response.AccountResponse;
import fit.iuh.kh3tshopbe.dto.response.CustomerResponse;
import fit.iuh.kh3tshopbe.entities.Account;
import fit.iuh.kh3tshopbe.entities.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValueCheckStrategy;

@Mapper(componentModel = "spring",
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface CustomerMapper {
    Customer toCustomer(CustomerRequest customerRequest);
    void updateCustomerFromRequest(CustomerRequest customerRequest, @MappingTarget Customer customer);

    @Mapping(source = "account.id", target = "accountId")
    CustomerResponse toCustomerResponse(Customer customer);
}
