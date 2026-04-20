package fit.iuh.kh3tshopbe.dto.ResetPassword;


import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResetPasswordRequest {
    String token;
    String newPassword;
    String otp;

}