package fit.iuh.kh3tshopbe.service;

import fit.iuh.kh3tshopbe.dto.request.CustomerTradingRequest;
import fit.iuh.kh3tshopbe.dto.response.CustomerTradingResponse;
import fit.iuh.kh3tshopbe.dto.response.RegionStatisticResponse;
import fit.iuh.kh3tshopbe.entities.CustomerTrading;
import fit.iuh.kh3tshopbe.mapper.CustomerTradingMapper;
import fit.iuh.kh3tshopbe.repository.CustomerTradingRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;


import java.util.*;



@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor

public class CustomerTradingService {
    CustomerTradingRepository customerTradingRepository;
    CustomerTradingMapper customerTradingMapper;

    public CustomerTradingResponse addCustomerTrading(CustomerTradingRequest customerTradingRequest) {
        CustomerTrading customerTrading = new CustomerTrading();
        customerTrading.setReceiverName(customerTradingRequest.getReceiverName());
        customerTrading.setReceiverAddress(customerTradingRequest.getReceiverAddress());
        customerTrading.setTradingDate(new Date());
        customerTrading.setCreatedAt(new Date());
        customerTrading.setReceiverEmail(customerTradingRequest.getReceiverEmail());
        customerTrading.setReceiverPhone(customerTradingRequest.getReceiverPhone());
        customerTrading.setTotalAmount(customerTradingRequest.getTotalAmount());
        customerTrading.setUpdatedAt(null);


        CustomerTrading savedCustomerTrading = customerTradingRepository.save(customerTrading);

        return customerTradingMapper.toCustomerTradingMapper(savedCustomerTrading);
    }

    public CustomerTrading getCustomerTradingById(int customerTradingId) {
        return customerTradingRepository.findById(customerTradingId).orElse(null);
    }


    public List<RegionStatisticResponse> getRegionStats() {

        List<Object[]> rows = customerTradingRepository.getRegionRawData();
        Map<String, RegionStatisticResponse> regionMap = new HashMap<>();

        for (Object[] row : rows) {

            String address = (String) row[0];
            long orders = (long) row[1];
            double revenue = (double) row[2];

            String region = detectRegion(address);

            regionMap.compute(region, (k, v) -> {
                if (v == null) {
                    return new RegionStatisticResponse(region, orders, revenue, mockGrowth(region));
                } else {
                    v.setOrders(v.getOrders() + orders);
                    v.setRevenue(v.getRevenue() + revenue);
                    return v;
                }
            });
        }

        return new ArrayList<>(regionMap.values());
    }

    private String detectRegion(String address) {
        address = address.toLowerCase();
        if (address.contains("hcm") || address.contains("tp.hcm") || address.contains("hồ chí minh"))
            return "TP.HCM";
        if (address.contains("hà nội"))
            return "Ha Noi";
        if (address.contains("đà nẵng"))
            return "Da Nang";
        if (address.contains("cần thơ"))
            return "Can Tho";

        return "Other";
    }

    private double mockGrowth(String region) {
        return switch (region) {
            case "TP.HCM" -> 12.5;
            case "Ha Noi" -> 15.3;
            case "Da Nang" -> 8.7;
            case "Can Tho" -> 5.2;
            default -> 3.8;
        };
    }

}
