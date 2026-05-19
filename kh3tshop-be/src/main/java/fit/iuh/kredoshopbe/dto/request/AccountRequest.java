package fit.iuh.kredoshopbe.dto.request;

import fit.iuh.kredoshopbe.enums.Role;
import fit.iuh.kredoshopbe.enums.StatusLogin;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountRequest {
    @Size(min = 3, message = "Username_Error")
    private String username;
    @Size(min = 6, message = "Password_Error")
    private String password;

    private CustomerRequest customer;
    @Enumerated(EnumType.STRING)
    private Role role;
    private StatusLogin statusLogin;

}
