package fit.iuh.kh3tshopbe.configuration;

import fit.iuh.kh3tshopbe.dto.request.AccountRequest;
import fit.iuh.kh3tshopbe.entities.Account;
import fit.iuh.kh3tshopbe.enums.Role;
import fit.iuh.kh3tshopbe.repository.AccountRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Slf4j
public class ApplicationInitConfig {
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Bean
    ApplicationRunner applicationRunner(AccountRepository accountRepository){
        return  args -> {
            if (!accountRepository.existsByUsername("admin")){
                Account account = Account.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .role(Role.ADMIN)
                        .build();
                accountRepository.save(account);
                log.warn("admin user has been created with username: admin and password: admin");
            }
        };
    }
}