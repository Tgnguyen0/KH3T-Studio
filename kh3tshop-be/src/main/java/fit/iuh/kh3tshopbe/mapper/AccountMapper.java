package fit.iuh.kh3tshopbe.mapper;

import fit.iuh.kh3tshopbe.dto.request.AccountRequest;
import fit.iuh.kh3tshopbe.dto.response.AccountResponse;
import fit.iuh.kh3tshopbe.entities.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValueCheckStrategy;

@Mapper(componentModel = "spring",
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface AccountMapper {

//    @Mapping(source = "username", target = "username")
//    @Mapping(target = "password", ignore = true)
    @Mapping(target = "customer", source = "customer")
    Account toAccount(AccountRequest accountRequest);

    void updateAccountFromRequest(AccountRequest accountRequest, @MappingTarget Account account);

    AccountResponse toAccountResponse(Account account);
}
