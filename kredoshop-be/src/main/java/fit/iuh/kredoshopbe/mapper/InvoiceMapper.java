package fit.iuh.kredoshopbe.mapper;

import fit.iuh.kredoshopbe.dto.response.InvoiceResponse;
import fit.iuh.kredoshopbe.entities.Invoice;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {
    InvoiceResponse toInvoiceMapper(Invoice invoice);

}
