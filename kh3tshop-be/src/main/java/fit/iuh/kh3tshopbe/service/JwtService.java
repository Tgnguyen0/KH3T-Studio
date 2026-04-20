package fit.iuh.kh3tshopbe.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);

    @Value("${jwt.password.reset.secret}")
    private String jwtResetSecret;

    @Value("${jwt.password.reset.expiration}")
    private long jwtResetExpiration;

    private SecretKey getPasswordResetSigningKey() {
        return Keys.hmacShaKeyFor(jwtResetSecret.getBytes());
    }

    public String generatePasswordResetToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtResetExpiration);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getPasswordResetSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getEmailFromPasswordResetToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public boolean validatePasswordResetToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getPasswordResetSigningKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            logger.error("JWT token validation error: {}", e.getMessage());
            return false;
        }
    }

    private <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parserBuilder()
                .setSigningKey(getPasswordResetSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }
}