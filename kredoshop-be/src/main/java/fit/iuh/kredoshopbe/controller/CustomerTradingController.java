package fit.iuh.kredoshopbe.controller;

import fit.iuh.kredoshopbe.dto.request.CustomerTradingRequest;
import fit.iuh.kredoshopbe.dto.response.CustomerTradingResponse;

import fit.iuh.kredoshopbe.dto.response.RegionStatisticResponse;

import fit.iuh.kredoshopbe.entities.CustomerTrading;
import fit.iuh.kredoshopbe.service.CustomerTradingService;
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

