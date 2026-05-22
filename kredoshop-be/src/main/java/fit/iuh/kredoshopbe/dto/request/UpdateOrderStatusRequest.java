package fit.iuh.kredoshopbe.dto.request;

import fit.iuh.kredoshopbe.enums.StatusOrdering;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateOrderStatusRequest {
    private StatusOrdering statusOrder;
}

