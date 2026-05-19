package fit.iuh.kredoshopbe.controller;

import fit.iuh.kredoshopbe.dto.request.OrderRequest;



import fit.iuh.kredoshopbe.dto.response.*;
import fit.iuh.kredoshopbe.dto.request.UpdateOrderStatusRequest;
import fit.iuh.kredoshopbe.dto.response.OrderResponse;
import fit.iuh.kredoshopbe.service.OrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import java.text.ParseException;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    OrderService orderService;

    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }
    @PostMapping("/create")
    public OrderResponse createOrder(@RequestBody OrderRequest orderRequest) throws ParseException {
        return orderService.createOrder(orderRequest);
    }

    @PutMapping("/status/{id}")
    public OrderResponse updateOrderStatus(@PathVariable int id, @RequestBody UpdateOrderStatusRequest request) {
        return orderService.updateOrderStatus(id, request.getStatusOrder());
    }

    @GetMapping("/detailed-orders")
    public List<DetailedOrderResponse> getAllDetailedOrders() {
        return orderService.getDetailedOrders();
    }

    @GetMapping("/time-slots")
    public List<TimeSlotStatisticResponse> getTimeSlots() {
        return orderService.getTimeSlotStats();
    }
    @GetMapping("/daily")
    public List<DailyStatisticResponse> getDailyStats(
            @RequestParam String start,
            @RequestParam String end) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);

        LocalDateTime startDateTime = startDate.atStartOfDay(); // 2025-11-10 00:00:00
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59); // 2025-11-10 23:59:59

        return orderService.getDailyStats(startDateTime, endDateTime);
    }


    @GetMapping("account/{account_id}")
    public List<OrderResponse> getOrderByAccountId(@PathVariable int account_id){
        return orderService.getOrdersByAccountId(account_id);
    }

}
