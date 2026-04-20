package fit.iuh.kh3tshopbe.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import fit.iuh.kh3tshopbe.dto.request.AuthenticationRequest;
import fit.iuh.kh3tshopbe.dto.request.IntrospectRequest;
import fit.iuh.kh3tshopbe.dto.response.AuthenticationResponse;
import fit.iuh.kh3tshopbe.dto.response.IntrospectResponse;
import fit.iuh.kh3tshopbe.entities.Account;
import fit.iuh.kh3tshopbe.entities.Customer;
import fit.iuh.kh3tshopbe.exception.AppException;
import fit.iuh.kh3tshopbe.exception.ErrorCode;
import fit.iuh.kh3tshopbe.repository.AccountRepository;
import fit.iuh.kh3tshopbe.repository.CustomerRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    AccountRepository accountRepository;
    PasswordEncoder passwordEncoder;
    EmailService emailService;
    JwtService jwtService;
    CustomerRepository customerRepository;

    public IntrospectResponse introspecct(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();

        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expityTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        var vertified = signedJWT.verify(verifier);
        return  IntrospectResponse.builder()
                .valid(vertified && expityTime.after(new Date()))
                .build();
    }
    public AuthenticationResponse authenticate(AuthenticationRequest request){
        var user = accountRepository.findByUsername(request.getUsername()).orElseThrow(
                () -> new AppException(ErrorCode.User_Not_Authenticated)
        );
        boolean authenticated =  passwordEncoder.matches(request.getPassword(), user.getPassword());

        if(!authenticated){
            throw new AppException(ErrorCode.Password_Failed);
        }
        var token = generationToken(user);
        return AuthenticationResponse.builder()
                .isAuthenticated(true)
                .token(token)
                .build();
    }

    private static final String SIGNER_KEY =
            "c8e09fddda9e192d16c485affabc61c9f4bca77a60c19d448f3a6e8475b9f0a4e0d1f69bca8d21f1123b8f0f8a0b8d12";
    private String generationToken(Account account) {
        try {
            JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(account.getUsername())
                    .issuer("kh3t-shop")
                    .issueTime(new Date())
                    .expirationTime(new Date(Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()))
                    .claim("scope", account.getRole().toString())
                    .build();

            Payload payload = new Payload(claimsSet.toJSONObject());
            JWSObject jwsObject = new JWSObject(header, payload);

            jwsObject.sign(new MACSigner(SIGNER_KEY));

            return jwsObject.serialize();
        } catch (Exception e) {
            throw new AppException(ErrorCode.Token_Generation_Failed);
        }
    }




}
