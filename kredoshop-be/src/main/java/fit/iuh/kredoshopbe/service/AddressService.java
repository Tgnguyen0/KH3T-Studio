package fit.iuh.kredoshopbe.service;

import fit.iuh.kredoshopbe.dto.request.AddressRequest;
import fit.iuh.kredoshopbe.dto.response.AddressResponse;
import fit.iuh.kredoshopbe.entities.Account;
import fit.iuh.kredoshopbe.entities.Address;
import fit.iuh.kredoshopbe.exception.AppException;
import fit.iuh.kredoshopbe.exception.ErrorCode;
import fit.iuh.kredoshopbe.mapper.AddressMapper;
import fit.iuh.kredoshopbe.repository.AddressRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class AddressService {
    AddressRepository addressRepository;
    AccountService accountService;
    AddressMapper addressMapper;

    public List<AddressResponse> getAddressByAccountId(int accountId) {
        Account account = accountService.getAccountByAccountId(accountId);

        List<Address> addressList = addressRepository.findByAccount(account);

        return addressList
                .stream()
                .map(addressMapper::toAddressResponse)
                .toList();
    }

    public AddressResponse saveAddress(AddressRequest addressRequest) {
        Account account = accountService.getAccountByAccountId(addressRequest.getAccountId());

        Address a = new Address();
        a.setDelivery_address(addressRequest.getDelivery_address());
        a.setAccount(account);
        a.setProvince(addressRequest.getProvince());
        a.setDelivery_note(addressRequest.getDelivery_note());

        Address savedAddress = addressRepository.save(a);

        return addressMapper.toAddressResponse(savedAddress);
    }


    public AddressResponse updateAddress(AddressRequest addressRequest) {
        Address existingAddress = addressRepository.findById(addressRequest.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

        existingAddress.setDelivery_address(addressRequest.getDelivery_address());
        existingAddress.setProvince(addressRequest.getProvince());
        existingAddress.setDelivery_note(addressRequest.getDelivery_note());
        // Account không thay đổi, giữ nguyên

        Address updatedAddress = addressRepository.save(existingAddress);

        return addressMapper.toAddressResponse(updatedAddress);
    }

    public void deleteAddress(Long id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));
        addressRepository.delete(address);
    }

}
