package fit.iuh.kredoshopbe.mapper;

import fit.iuh.kredoshopbe.dto.response.AddressResponse;
import fit.iuh.kredoshopbe.entities.Address;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    AddressResponse toAddressResponse(Address address);
}
