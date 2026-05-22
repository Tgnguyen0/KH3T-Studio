package fit.iuh.kredoshopbe.dto.response;

import fit.iuh.kredoshopbe.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerResponse {
    private int id;
    private int accountId;
    private String fullName;
    private String phoneNumber;
    private String email;
    private Gender gender;
    private Date dateOfBirth;

}
