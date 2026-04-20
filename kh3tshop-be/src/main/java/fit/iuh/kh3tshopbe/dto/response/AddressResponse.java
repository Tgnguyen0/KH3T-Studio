package fit.iuh.kh3tshopbe.dto.response;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponse {

    private String city;
    private Long id;
    private String province;
    private String delivery_address;
    private String delivery_note;
}
