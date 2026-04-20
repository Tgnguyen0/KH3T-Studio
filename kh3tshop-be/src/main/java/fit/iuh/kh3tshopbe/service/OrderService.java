package fit.iuh.kh3tshopbe.service;

import fit.iuh.kh3tshopbe.dto.request.OrderRequest;
import fit.iuh.kh3tshopbe.dto.response.DailyStatisticResponse;
import fit.iuh.kh3tshopbe.dto.response.DetailedOrderResponse;
import fit.iuh.kh3tshopbe.dto.response.OrderResponse;
import fit.iuh.kh3tshopbe.dto.response.TimeSlotStatisticResponse;
import fit.iuh.kh3tshopbe.entities.Account;
import fit.iuh.kh3tshopbe.entities.CustomerTrading;
import fit.iuh.kh3tshopbe.entities.Order;
import fit.iuh.kh3tshopbe.enums.StatusOrdering;
import fit.iuh.kh3tshopbe.exception.AppException;
import fit.iuh.kh3tshopbe.exception.ErrorCode;
import fit.iuh.kh3tshopbe.mapper.CustomerTradingMapper;
import fit.iuh.kh3tshopbe.mapper.OrderMapper;
import fit.iuh.kh3tshopbe.repository.AccountRepository;
import fit.iuh.kh3tshopbe.repository.OrderRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;
import java.util.Date;
import java.util.List;


import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor

public class OrderService {
    OrderRepository orderRepository;
    CustomerTradingService customerTradingService;
    CustomerTradingMapper customerTradingMapper;
    AccountRepository accountRepository;
    OrderMapper orderMapper;

    public OrderResponse createOrder(OrderRequest request) throws ParseException {
        CustomerTrading ct = customerTradingService.getCustomerTradingById(request.getCustomerTradingId());
        Account acc = accountRepository.findById(request.getAccount_id()).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        Order order = new Order();
        order.setOrderCode(generateOrderCode());
        order.setNote(request.getNote());
        order.setOrderDate(new Date());
        order.setStatusOrder(StatusOrdering.PENDING);
        order.setCustomerTrading(ct);
        order.setAccount(acc);
        order.setPaymentMethod(request.getPaymentMethod());
        Order saved = orderRepository.save(order);

        return orderMapper.toOrderMapper(saved);
    }

    public int countTodayOrders() throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String todayStr = sdf.format(new Date());

        SimpleDateFormat fullSdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date start = fullSdf.parse(todayStr + " 00:00:00");
        Date end = fullSdf.parse(todayStr + " 23:59:59");

        return orderRepository.countOrderByOrderDateBetween(start, end);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toOrderMapper)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(int id) {
        return orderRepository.findById(id)
                .map(orderMapper::toOrderMapper)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public OrderResponse updateOrderStatus(int orderId, StatusOrdering statusOrder) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        order.setStatusOrder(statusOrder);
        Order updated = orderRepository.save(order);
        return orderMapper.toOrderMapper(updated);
    }

    // Thêm method mới để áp cứng CONFIRMED
//    public OrderResponse confirmOrder(int orderId) {
//        return updateOrderStatus(orderId, StatusOrdering.CONFIRMED);
//    }
    private String generateOrderCode() throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String todayStr = sdf.format(new Date());

        SimpleDateFormat fullSdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date start = fullSdf.parse(todayStr + " 00:00:00");
        Date end = fullSdf.parse(todayStr + " 23:59:59");

        int countToday = orderRepository.countOrderByOrderDateBetween(start, end) + 1;
        String index = String.format("%03d", countToday);

        SimpleDateFormat codeDate = new SimpleDateFormat("yyyyMMdd");
        return "ORD" + codeDate.format(new Date()) + index;
    }



    public List<DetailedOrderResponse> getDetailedOrders() {

        List<Object[]> rows = orderRepository.getDetailedOrders();
        List<DetailedOrderResponse> result = new ArrayList<>();

        for (Object[] row : rows) {

            String id = (String) row[0];
            String customer = (String) row[1];
            double total = (double) row[2];
            String payment = convertPayment(row[3].toString());
            String status = convertStatus(row[4].toString());
            Date date = (Date) row[5];
            int items = (int) row[6];

            result.add(new DetailedOrderResponse(
                    id,
                    customer,
                    total,
                    payment,
                    status,
                    formatDate(date),
                    items
            ));
        }

        return result;
    }

    private String formatDate(Date date) {
        return new java.text.SimpleDateFormat("yyyy-MM-dd").format(date);
    }

    private String convertPayment(String m) {
        return switch (m) {
            case "CASH" -> "COD";
            case "BANK_TRANSFER" -> "Banking";
            default -> "Không rõ";
        };
    }

    private String convertStatus(String s) {
        return switch (s) {
            case "COMPLETED" -> "Hoàn thành";
            case "DELIVERING" -> "Đang giao";
            case "PROCESSING" -> "Đang xử lý";
            case "CANCELLED" -> "Đã hủy";
            default -> s;
        };
    }
    private Map<String, TimeSlotStatisticResponse> initSlots() {
        Map<String, TimeSlotStatisticResponse> m = new LinkedHashMap<>();
        m.put("6h-9h", new TimeSlotStatisticResponse("6h-9h", 0, 0));
        m.put("9h-12h", new TimeSlotStatisticResponse("9h-12h", 0, 0));
        m.put("12h-15h", new TimeSlotStatisticResponse("12h-15h", 0, 0));
        m.put("15h-18h", new TimeSlotStatisticResponse("15h-18h", 0, 0));
        m.put("18h-21h", new TimeSlotStatisticResponse("18h-21h", 0, 0));
        m.put("21h-24h", new TimeSlotStatisticResponse("21h-24h", 0, 0));
        return m;
    }
    private String getSlot(int hour) {
        if (hour >= 6  && hour < 9)  return "6h-9h";
        if (hour >= 9  && hour < 12) return "9h-12h";
        if (hour >= 12 && hour < 15) return "12h-15h";
        if (hour >= 15 && hour < 18) return "15h-18h";
        if (hour >= 18 && hour < 21) return "18h-21h";
        if (hour >= 21 && hour < 24) return "21h-24h";
        return null;
    }
    public List<TimeSlotStatisticResponse> getTimeSlotStats() {
        List<Order> orders = orderRepository.findAll(); // LẤY TỪ DATABASE
        Map<String, TimeSlotStatisticResponse> result = initSlots();
        for (Order o : orders) {
            if (o.getOrderDate() == null) continue;
            Calendar cal = Calendar.getInstance();
            cal.setTime(o.getOrderDate());
            int hour = cal.get(Calendar.HOUR_OF_DAY);
            String slot = getSlot(hour);
            if (slot == null) continue;
            TimeSlotStatisticResponse dto = result.get(slot);
            // tăng số lượng đơn
            dto.setOrders(dto.getOrders() + 1);

            // cộng doanh thu từ Invoice thật trong DB
            if (o.getInvoice() != null) {
                dto.setRevenue(dto.getRevenue() + o.getInvoice().getTotalAmount());
            }
        }
        return new ArrayList<>(result.values());
    }
    public List<DailyStatisticResponse> getDailyStats(LocalDateTime start, LocalDateTime  end) {
        List<Order> orders = orderRepository.findByOrderDateBetween(start, end);
        Map<String, DailyStatisticResponse> map = new TreeMap<>();
        for (Order o : orders) {
            String day = new SimpleDateFormat("yyyy-MM-dd").format(o.getOrderDate());
            map.putIfAbsent(day, new DailyStatisticResponse(day, 0, 0, 0, 0));
            DailyStatisticResponse dto = map.get(day);
            dto.setOrders(dto.getOrders() + 1);
            if (o.getInvoice() != null) {
                dto.setRevenue((long) (dto.getRevenue() + o.getInvoice().getTotalAmount()));
            }
            dto.setCustomers(dto.getCustomers() + 1);
            dto.setProducts(dto.getProducts() + o.getOrderDetails().size());
        }
        return new ArrayList<>(map.values());
    }


    public List<OrderResponse> getOrdersByAccountId(int account_id) {
        Account account = accountRepository.findById(account_id).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        List<Order> orders = orderRepository.findByAccount(account).stream()
                .filter(order -> order.getStatusOrder() != StatusOrdering.CANCELLED).collect(Collectors.toList());
        return orders.stream().map(orderMapper::toOrderMapper).collect(Collectors.toList());
    }



}