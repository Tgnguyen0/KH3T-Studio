package fit.iuh.kh3tshopbe.dto.request;

import fit.iuh.kh3tshopbe.enums.StatusOrdering;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateOrderStatusRequest {
    private StatusOrdering statusOrder;
}

