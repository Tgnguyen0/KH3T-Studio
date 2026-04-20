package fit.iuh.kh3tshopbe.controller;

import fit.iuh.kh3tshopbe.dto.request.OrderDetailRequest;
import fit.iuh.kh3tshopbe.dto.response.OrderDetailResponse;
import fit.iuh.kh3tshopbe.service.OrderDetailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/order-details")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderDetailController {
    OrderDetailService orderDetailService;

    @PostMapping("/create")
    public OrderDetailResponse createOrderDetail(@RequestBody OrderDetailRequest orderDetailRequest) {
        return orderDetailService.createOrderDetail(orderDetailRequest);
    }
}
