package fit.iuh.kh3tshopbe.service;

import fit.iuh.kh3tshopbe.dto.request.CustomerRequest;
import fit.iuh.kh3tshopbe.dto.request.CustomerUpdateRequest;
import fit.iuh.kh3tshopbe.dto.response.CustomerResponse;
import fit.iuh.kh3tshopbe.entities.Customer;
import fit.iuh.kh3tshopbe.enums.Status;
import fit.iuh.kh3tshopbe.exception.AppException;
import fit.iuh.kh3tshopbe.exception.ErrorCode;
import fit.iuh.kh3tshopbe.mapper.CustomerMapper;
import fit.iuh.kh3tshopbe.repository.CustomerRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerService {
    CustomerRepository customerRepository;
    CustomerMapper customerMapper;
    public Customer saveCustomer(CustomerRequest customerRequest){
        System.out.println("Saving customer: " + customerRequest.getFullName());
        Customer customer = customerMapper.toCustomer(customerRequest);
        customer.setCreateAt(Date.from(LocalDate.now().atStartOfDay().atZone(java.time.ZoneId.systemDefault()).toInstant()));
        customer.setUpdateAt(Date.from(LocalDate.now().atStartOfDay().atZone(java.time.ZoneId.systemDefault()).toInstant()));
        customer.setStatus(Status.ACTIVE);
        return customerRepository.save(customer);
    }

    public Customer getCustomerByEmail(String email){
        return customerRepository.findByEmail(email);
    }

    public boolean existsByEmail(String email) {
        return customerRepository.existsByEmail(email);
    }


    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(customerMapper::toCustomerResponse)
                .toList();
    }
    @Transactional
    public CustomerResponse updateCustomerProfile(CustomerUpdateRequest request) {
        Customer existingCustomer = customerRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 2. Cập nhật các trường
        existingCustomer.setFullName(request.getFullName());
        existingCustomer.setPhoneNumber(request.getPhoneNumber());
        existingCustomer.setEmail(request.getEmail());
        existingCustomer.setGender(request.getGender());
        existingCustomer.setDateOfBirth(request.getDateOfBirth());
        existingCustomer.setUpdateAt(new Date());

        // 3. Lưu vào database
        Customer updatedCustomer = customerRepository.save(existingCustomer);

        // 4. Trả về Response
        return customerMapper.toCustomerResponse(updatedCustomer);
    }


    public List<Customer> getAll() {
        return customerRepository.findAll();
    }


    public CustomerResponse getCurrentCustomerProfile(int customerId) {
        Customer customer = customerRepository.findById(customerId);

        return customerMapper.toCustomerResponse(customer);
    }



    public CustomerResponse getCustomerById(int id) {
        Customer customer = customerRepository.findById(id);

        return customerMapper.toCustomerResponse(customer);
    }

    public Customer getCustomerEntityById(int id) {
        return customerRepository.findById(id);
    }
}

