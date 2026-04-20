package fit.iuh.kh3tshopbe.controller;
import fit.iuh.kh3tshopbe.dto.request.AccountRequest;
import fit.iuh.kh3tshopbe.dto.request.MeetingRequest;
import fit.iuh.kh3tshopbe.dto.response.AccountResponse;
import fit.iuh.kh3tshopbe.dto.response.ApiResponse;
import fit.iuh.kh3tshopbe.entities.Account;
import fit.iuh.kh3tshopbe.entities.Customer;

import fit.iuh.kh3tshopbe.service.AccountService;

import fit.iuh.kh3tshopbe.service.CustomerService;

import fit.iuh.kh3tshopbe.service.EmailService;
import fit.iuh.kh3tshopbe.service.GoogleCalendarService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AccountController {
    AccountService accountService;

    GoogleCalendarService googleCalendarService;
    EmailService emailService;
    CustomerService customerService;

    // @valid thông báo cần kiểm tra request
    @PostMapping
    public ApiResponse<AccountResponse> register(@RequestBody @Valid AccountRequest accountRequest){
        ApiResponse<AccountResponse> accountApiResponse = new ApiResponse<>();
        accountApiResponse.setResult(accountService.addAccount(accountRequest));
        return accountApiResponse;
    }

    @GetMapping("/{id}")
    public ApiResponse<AccountResponse> getAccountById(@PathVariable("id") Integer id) {
        ApiResponse<AccountResponse> accountResponseApiResponse = new ApiResponse<>();
        accountResponseApiResponse.setResult(accountService.getAccountById(id));
        return accountResponseApiResponse;
    }

    @GetMapping
    public ApiResponse<List<AccountResponse>> getAllAccounts(
            @RequestParam(required = false)String name,
            @RequestParam(required = false)String status,
            @RequestParam(required = false)String role){
        ApiResponse<List<AccountResponse>> response = new ApiResponse<>();
        // Giả sử bạn có phương thức getAllAccounts trong AccountService
        response.setResult(accountService.getAllAccounts(name, status, role));
        return response;
    }

    @GetMapping("/myinfor")
    public ApiResponse<AccountResponse> getMyAccount(){
        ApiResponse<AccountResponse> response = new ApiResponse<>();
        response.setResult(accountService.getMyAccount());
        return response;
    }

    @GetMapping("/username/{username}")
    public ApiResponse<AccountResponse> getAccountByUsername(@PathVariable String username){
        ApiResponse<AccountResponse> response = new ApiResponse<>();
        response.setResult(accountService.getAccountByUsername(username));
        return response;
    }



    @PostMapping("/admin/add")
    public ApiResponse<AccountResponse> addAccountByAdmin(@RequestBody @Valid AccountRequest accountRequest){
        ApiResponse<AccountResponse> accountApiResponse = new ApiResponse<>();
        accountApiResponse.setResult(accountService.addAccountByAdmin(accountRequest));
        return accountApiResponse;
    }

    @PutMapping("/admin/update/{id}")
    public ApiResponse<AccountResponse> updateAccountByAdmin(@PathVariable("id") Integer id,
                                                             @RequestBody @Valid AccountRequest accountRequest){
        ApiResponse<AccountResponse> accountApiResponse = new ApiResponse<>();
        accountApiResponse.setResult(accountService.updateAccountByAdmin(id, accountRequest));
        return accountApiResponse;
    }

    @DeleteMapping("/admin/delete/{id}")
    public ApiResponse<AccountResponse> deleteAccountByAdmin(@PathVariable("id") Integer id){
        ApiResponse<AccountResponse> accountApiResponse = new ApiResponse<>();
        accountApiResponse.setResult(accountService.deleteAccountByAdmin(id));
        return accountApiResponse;
    }

    @PostMapping("/meetings/create")
    public ApiResponse<?> createMeeting(@RequestBody MeetingRequest req) {
        try {
            String meetLink = googleCalendarService.createMeeting(
                    req.getTitle(),
                    req.getDescription(),
                    req.getStartTime(),
                    req.getEndTime()
            );

            List<Customer> employees = accountService.getAllEmployees();

            emailService.createMeetingEmail(employees, meetLink);

            return ApiResponse.builder()
                    .result("Meeting created and emails sent to employees." + " Link: " + meetLink)
                    .build();
        } catch (Exception e) {
            return ApiResponse.builder()
                    .result("Failed to create meeting: " + e.getMessage())
                    .code(500)
                    .build();
        }
    }

}
