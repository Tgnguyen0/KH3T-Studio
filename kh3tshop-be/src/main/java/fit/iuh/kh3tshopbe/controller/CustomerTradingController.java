package fit.iuh.kh3tshopbe.controller;

import fit.iuh.kh3tshopbe.dto.request.CustomerTradingRequest;
import fit.iuh.kh3tshopbe.dto.response.CustomerTradingResponse;

import fit.iuh.kh3tshopbe.dto.response.RegionStatisticResponse;

import fit.iuh.kh3tshopbe.entities.CustomerTrading;
import fit.iuh.kh3tshopbe.service.CustomerTradingService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/customer-trading")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerTradingController {

    CustomerTradingService customerTradingService;

    @PostMapping("/create")
    public CustomerTradingResponse customerTradingResponse(@RequestBody CustomerTradingRequest customerTradingRequest) {
        return customerTradingService.addCustomerTrading(customerTradingRequest);
    }

    @GetMapping("/{customerTradingId}")
    public CustomerTrading getCustomerTrading(@PathVariable int customerTradingId) {
        return customerTradingService.getCustomerTradingById(customerTradingId);
    }


    @GetMapping("/regions")
    public List<RegionStatisticResponse> getRegionStatistics() {
        return customerTradingService.getRegionStats();
    }

}

