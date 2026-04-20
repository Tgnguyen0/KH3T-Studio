package fit.iuh.kh3tshopbe.controller;

import fit.iuh.kh3tshopbe.dto.request.AddressRequest;
import fit.iuh.kh3tshopbe.dto.response.AddressResponse;
import fit.iuh.kh3tshopbe.service.AddressService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/addresses")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AddressController {
    AddressService addressService;

    @GetMapping("/{accountId}")
    public List<AddressResponse> getAddress(@PathVariable int accountId) {
        return addressService.getAddressByAccountId(accountId);
    }

    @PostMapping("/add")
    public AddressResponse addAddress(@RequestBody AddressRequest addressRequest) {
        return addressService.saveAddress(addressRequest);
    }

    // Endpoint mới: Update Address
    @PutMapping("/update")
    public AddressResponse updateAddress(@RequestBody AddressRequest addressRequest) {
        return addressService.updateAddress(addressRequest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable long id) {
        // BƯỚC KIỂM TRA: In ra ID được nhận
        System.out.println("Attempting to delete address ID: " + id);

        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }
}

