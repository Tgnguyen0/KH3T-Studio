package fit.iuh.kh3tshopbe.controller;

import fit.iuh.kh3tshopbe.dto.response.ApiResponse;
import fit.iuh.kh3tshopbe.dto.response.CustomerResponse;
import fit.iuh.kh3tshopbe.dto.request.CustomerUpdateRequest;
import fit.iuh.kh3tshopbe.dto.response.AccountResponse;
import fit.iuh.kh3tshopbe.dto.response.ApiResponse;
import fit.iuh.kh3tshopbe.dto.response.CustomerResponse;
import fit.iuh.kh3tshopbe.entities.Customer;
import fit.iuh.kh3tshopbe.entities.Product;

import fit.iuh.kh3tshopbe.service.CustomerService;
import fit.iuh.kh3tshopbe.service.EmailService;
import fit.iuh.kh3tshopbe.service.ProductService;


import fit.iuh.kh3tshopbe.repository.ProductRepository;
import fit.iuh.kh3tshopbe.service.*;
import fit.iuh.kh3tshopbe.exception.AppException;
import fit.iuh.kh3tshopbe.exception.ErrorCode;
import fit.iuh.kh3tshopbe.service.CustomerService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;



import java.util.List;


import org.springframework.security.core.context.SecurityContextHolder; // ✅ Thêm import này
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerController {
    CustomerService customerService;
    ProductService productService;
    EmailService emailService;
    AccountService accountService;
    private final ProductRepository productRepository;
    private final OrderService orderService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ApiResponse<List<CustomerResponse>> getCustomers() {
        ApiResponse<List<CustomerResponse>> customerResponseApiResponse = new ApiResponse<>();
        customerResponseApiResponse.setResult(customerService.getAllCustomers());
       return customerResponseApiResponse;
    }
    @PostMapping("/email/sale/all")
    public ApiResponse<?> sendSaleEmailToAll() {
        List<Customer> customers = customerService.getAll();
        List<Product> sale = productService.getSaleProducts();

        emailService.sendEmailToAllCustomers(customers, sale);

        return ApiResponse.builder()
                .result("Đã gửi email thông báo sold off đến tất cả khách hàng.")
                .build();
    }

    @PostMapping("/email/notification/{customerId}/{orderId}")
    public ApiResponse<?> sendNotificationEmailToCustomer(
            @PathVariable int customerId,
            @PathVariable int orderId) {

        Customer customer = customerService.getCustomerEntityById(customerId);

        emailService.sendEmailToCustomerAfterPurchase(
                customer,
                orderService.getOrderById(orderId)
        );

        return ApiResponse.builder()
                .result("Đã gửi email thông báo đến khách hàng có ID: " + customerId)
                .build();
    }




    @PreAuthorize("isAuthenticated()")
    @GetMapping("/profile")
    public ApiResponse<CustomerResponse> getCurrentCustomerProfile() {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        // 1. Lấy AccountResponse
        AccountResponse accountResponse = accountService.getAccountByUsername(currentUsername);

        // 2. Kiểm tra NULL TRƯỚC KHI TRUY CẬP .getCustomer()
        if (accountResponse == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND); // hoặc lỗi phù hợp hơn
        }

        CustomerResponse customerResponse = accountResponse.getCustomer();

        if (customerResponse == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        int customerId = customerResponse.getId();

        ApiResponse<CustomerResponse> response = new ApiResponse<>();
        response.setResult(customerService.getCurrentCustomerProfile(customerId));
        response.setCode(200);
        response.setMessage("Lấy hồ sơ thành công");
        return response;
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/update-profile")
    public ApiResponse<CustomerResponse> updateProfile(@RequestBody @Valid CustomerUpdateRequest request) {
        // ✅ THÊM LOGIC CHECK ID KHỚP CURRENT USER
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        AccountResponse accountResponse = accountService.getAccountByUsername(currentUsername);
        if (accountResponse == null || accountResponse.getCustomer() == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        int currentCustomerId = accountResponse.getCustomer().getId();
        if (!request.getId().equals(currentCustomerId)) {
            throw new AppException(ErrorCode.User_Not_Authorized);  // Hoặc ErrorCode phù hợp
        }

        ApiResponse<CustomerResponse> response = new ApiResponse<>();
        response.setResult(customerService.updateCustomerProfile(request));
        response.setCode(200);
        response.setMessage("Updated Profile Successful!");
        return response;
    }

    @GetMapping("/{id}")
    public CustomerResponse getCustomerById(@PathVariable int id) {
        return customerService.getCustomerById(id);
    }

}


