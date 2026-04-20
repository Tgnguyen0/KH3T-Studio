package fit.iuh.kh3tshopbe.dto.request;

import fit.iuh.kh3tshopbe.enums.Gender;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerRequest {
    private String fullName;
    private String phoneNumber;
    private String email;
    private Gender gender;
    private Date dateOfBirth;
}
