package fit.iuh.kredoshopbe.dto.response;

import fit.iuh.kredoshopbe.enums.Role;
import fit.iuh.kredoshopbe.enums.StatusLogin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class AccountResponse {
    int id;
    CustomerResponse customer;
    String username;
    Role role;
    Date createAt;
    Date updateAt;
    StatusLogin statusLogin;
}
