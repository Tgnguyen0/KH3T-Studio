package fit.iuh.kh3tshopbe.controller;

import com.nimbusds.jose.JOSEException;
import fit.iuh.kh3tshopbe.configuration.JwtUtil;
import fit.iuh.kh3tshopbe.dto.ResetPassword.ForgotPasswordRequest;
import fit.iuh.kh3tshopbe.dto.ResetPassword.ResetPasswordRequest;
import fit.iuh.kh3tshopbe.dto.request.AuthenticationRequest;
import fit.iuh.kh3tshopbe.dto.request.IntrospectRequest;
import fit.iuh.kh3tshopbe.dto.response.AccountResponse;
import fit.iuh.kh3tshopbe.dto.response.ApiResponse;
import fit.iuh.kh3tshopbe.dto.response.AuthenticationResponse;
import fit.iuh.kh3tshopbe.dto.response.IntrospectResponse;
import fit.iuh.kh3tshopbe.entities.Account;
import fit.iuh.kh3tshopbe.entities.Customer;
import fit.iuh.kh3tshopbe.exception.AppException;
import fit.iuh.kh3tshopbe.exception.ErrorCode;
import fit.iuh.kh3tshopbe.repository.AccountRepository;
import fit.iuh.kh3tshopbe.repository.CustomerRepository;
import fit.iuh.kh3tshopbe.service.AccountService;
import fit.iuh.kh3tshopbe.service.AuthenticationService;
import fit.iuh.kh3tshopbe.service.EmailService;
import fit.iuh.kh3tshopbe.service.JwtService;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.Random;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;
    AccountService accountService;
    JwtUtil jwtUtil;
    EmailService emailService;
    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> login(@RequestBody AuthenticationRequest request){
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/introspect")
    public ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = authenticationService.introspecct(request);
        return ApiResponse.<IntrospectResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/forgot-password")
    public ApiResponse<ResetPasswordRequest> forgotPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        ResetPasswordRequest resetPasswordRequest = new ResetPasswordRequest();
        Account account = accountService.findAccountByCustomerEmail(forgotPasswordRequest.getEmail());
        if (account == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        // Tạo OTP 6 số
        String otp = String.format("%06d", new Random().nextInt(999999));
        String token = jwtUtil.generateResetToken(forgotPasswordRequest.getEmail());
        resetPasswordRequest.setToken(token);
        resetPasswordRequest.setOtp(otp);
        resetPasswordRequest.setNewPassword("");
        // Gửi email
        emailService.sendSimpleEmail(
                forgotPasswordRequest.getEmail(),
                "Reset Password OTP",
                "Your verification code is: " + otp
        );
        return ApiResponse.<ResetPasswordRequest>builder()
                .result(resetPasswordRequest)
                .build();
    }



    @PostMapping("/reset-password")
    public ApiResponse<String> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        try {
            String email = jwtUtil.extractEmail(resetPasswordRequest.getToken());

            Account account = accountService.findAccountByCustomerEmail(email);
            if (account == null) {
                return ApiResponse.<String>builder()
                        .result("Invalid token!")
                        .build();
            }

            // encode password
            account.setPassword(new BCryptPasswordEncoder().encode(resetPasswordRequest.getNewPassword()));
            accountService.saveAccount(account);

            return ApiResponse.<String>builder()
                    .result("Password has been reset successfully.")
                    .build();
        } catch (ExpiredJwtException ex) {
            return ApiResponse.<String>builder()
                    .result("Token has expired!")
                    .build();
        } catch (Exception ex) {
            return ApiResponse.<String>builder()
                    .result("An error occurred while resetting the password.")
                    .build();
        }
    }

}
