package fit.iuh.kredoshopbe.service;

import fit.iuh.kredoshopbe.configuration.SePayConfig;
import fit.iuh.kredoshopbe.dto.request.CreateInvoiceRequest;
import fit.iuh.kredoshopbe.dto.response.InvoiceResponse;
import fit.iuh.kredoshopbe.dto.response.PaymentStatisticResponse;
import fit.iuh.kredoshopbe.entities.Invoice;
import fit.iuh.kredoshopbe.entities.Order;

import fit.iuh.kredoshopbe.enums.PaymentMethod;
import fit.iuh.kredoshopbe.enums.StatusPayment;
import fit.iuh.kredoshopbe.enums.StatusOrdering;
import fit.iuh.kredoshopbe.exception.AppException;
import fit.iuh.kredoshopbe.exception.ErrorCode;

import fit.iuh.kredoshopbe.mapper.InvoiceMapper;
import fit.iuh.kredoshopbe.repository.InvoiceRepository;
import fit.iuh.kredoshopbe.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.List;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceMapper invoiceMapper;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final DateTimeFormatter DATETIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS");
    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;
    private final SePayConfig sePayConfig;

    @Transactional
    public InvoiceResponse createInvoice(CreateInvoiceRequest request) {
        // 1. Tìm Order và kiểm tra tồn tại + chưa có invoice
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + request.getOrderId()));

        if (order.getInvoice() != null) {
            throw new RuntimeException("Đơn hàng này đã có hóa đơn rồi!");
        }

        // 2. Tạo invoiceCode tự động: INV-YYYYMMDD-XXX
        String invoiceCode = generateInvoiceCode();

        // 3. Tạo invoice
        Invoice invoice = new Invoice();
        invoice.setInvoiceCode(invoiceCode);
        invoice.setPaymentMethod(request.getPaymentMethod());
        invoice.setPaymentStatus(request.getPaymentStatus());
        invoice.setSubtotalAmount(order.getCustomerTrading().getTotalAmount());
        invoice.setTaxAmount(0.0);
        invoice.setTotalAmount(order.getCustomerTrading().getTotalAmount());

        LocalDateTime now = LocalDateTime.now();
        invoice.setCreatedAt(java.sql.Timestamp.valueOf(now));
        invoice.setUpdatedAt(java.sql.Timestamp.valueOf(now));

        // Liên kết với Order
        invoice.setOrder(order);

        // Lưu
        Invoice savedInvoice = invoiceRepository.save(invoice);

        // Trả về response
        return invoiceMapper.toInvoiceMapper(savedInvoice);
    }

    // Sinh mã hóa đơn: INV-20250807-001, INV-20250807-002,...
    private String generateInvoiceCode() {
        LocalDate today = LocalDate.now();
        String datePart = today.format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        long count = invoiceRepository.countByCreatedAtBetween(startOfDay, endOfDay);
        String sequence = String.format("%03d", count + 1);

        return "INV-" + datePart + "-" + sequence;
    }

    public List<InvoiceResponse> getAllInvoices() {
        return invoiceRepository.findAll().stream()
                .map(invoiceMapper::toInvoiceMapper)
                .collect(Collectors.toList());
    }

    private Date toDateStart(LocalDate date) {
        return java.sql.Timestamp.valueOf(date.atStartOfDay());
    }

    private Date toDateEnd(LocalDate date) {
        return java.sql.Timestamp.valueOf(date.atTime(23, 59, 59));
    }

    public List<Map<String, Object>> getProfitWeekly(LocalDate startDate, LocalDate endDate) {

        Date start = toDateStart(startDate);
        Date end = toDateEnd(endDate);

        List<Object[]> results = invoiceRepository.getProfitByWeek(start, end);

        // Convert DB data thành map week → profit
        Map<Integer, Double> profitMap = new HashMap<>();
        for (Object[] row : results) {
            Integer week = (Integer) row[1];
            Double profit = (Double) row[2];
            profitMap.put(week, profit);
        }

        int weekNumber = startDate.get(WeekFields.ISO.weekOfWeekBasedYear());
        int year = startDate.getYear();

        List<Map<String, Object>> finalList = new ArrayList<>();

        // Chỉ 1 tuần → fill đủ thứ 2 → CN
        for (int i = 1; i <= 7; i++) {
            Map<String, Object> item = new HashMap<>();
            item.put("year", year);
            item.put("week", weekNumber);
            item.put("day", startDate.plusDays(i - 1).getDayOfWeek().toString());
            item.put("profit", profitMap.getOrDefault(weekNumber, 0.0));
            finalList.add(item);
        }

        return finalList;
    }

    public List<Map<String, Object>> getProfitMonthly(LocalDate startDate, LocalDate endDate) {
        Date start = toDateStart(startDate);
        Date end = toDateEnd(endDate);

        List<Object[]> results = invoiceRepository.getProfitByMonth(start, end);

        // Convert DB results thành map dạng "month → profit"
        Map<Integer, Double> profitMap = new HashMap<>();
        for (Object[] row : results) {
            Integer month = (Integer) row[1];
            Double profit = (Double) row[2];
            profitMap.put(month, profit);
        }

        // Tạo danh sách 12 tháng, fill profit = 0 nếu không có
        List<Map<String, Object>> finalList = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            Map<String, Object> item = new HashMap<>();
            item.put("year", startDate.getYear());
            item.put("month", month);
            item.put("profit", profitMap.getOrDefault(month, 0.0));
            finalList.add(item);
        }
        return finalList;
    }

    public List<Map<String, Object>> getProfitYearly(LocalDate startDate, LocalDate endDate) {

        Date start = toDateStart(startDate);
        Date end = toDateEnd(endDate);

        List<Object[]> results = invoiceRepository.getProfitByYear(start, end);

        // Đưa DB vào map
        Map<Integer, Double> profitMap = new HashMap<>();
        for (Object[] row : results) {
            Integer year = (Integer) row[0];
            Double profit = (Double) row[1];
            profitMap.put(year, profit);
        }

        List<Map<String, Object>> finalList = new ArrayList<>();

        int startYear = startDate.getYear();
        int endYear = endDate.getYear();

        for (int year = startYear; year <= endYear; year++) {
            Map<String, Object> item = new HashMap<>();
            item.put("year", year);
            item.put("profit", String.format("%,.0f", profitMap.getOrDefault(year, 0.0)));
            finalList.add(item);
        }

        return finalList;
    }



    private static final Map<PaymentMethod, String> COLOR_MAP = Map.of(
            PaymentMethod.CASH, "#10b981",
            PaymentMethod.BANK_TRANSFER, "#6366f1"
    );

    public List<PaymentStatisticResponse> getPaymentStatistics() {

        List<Object[]> results = invoiceRepository.getPaymentStatistics();
        List<PaymentStatisticResponse> dtoList = new ArrayList<>();

        for (Object[] row : results) {

            PaymentMethod method = (PaymentMethod) row[0];
            long count = (long) row[1];
            double revenue = (double) row[2];

            dtoList.add(
                    new PaymentStatisticResponse(
                            convertName(method), // tên hiển thị
                            count,               // value
                            revenue,             // doanh thu
                            COLOR_MAP.get(method),
                            count                // số đơn
                    )
            );
        }

        return dtoList;
    }

    private String convertName(PaymentMethod p) {
        return switch (p) {
            case CASH -> "Cash on Delivery (COD)";
            case BANK_TRANSFER -> "Bank Transfer";
        };
    }


    public InvoiceResponse getInvoiceById(int id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVOICE_NOT_FOUND));

        if (invoice.getPaymentStatus() != StatusPayment.PAID && invoice.getPaymentMethod() == PaymentMethod.BANK_TRANSFER) {
            checkSePayPaymentDirectly(invoice);
        }

        return invoiceMapper.toInvoiceMapper(invoice);
    }

    @SuppressWarnings("unchecked")
    private void checkSePayPaymentDirectly(Invoice invoice) {
        try {
            String url = "https://userapi.sepay.vn/v2/transactions?limit=20";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + sePayConfig.getApiKey());
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                if ("success".equals(body.get("status"))) {
                    List<Map<String, Object>> data = (List<Map<String, Object>>) body.get("data");
                    if (data != null && !data.isEmpty()) {
                        // Chuẩn hóa mã hóa đơn mục tiêu (bỏ dấu gạch ngang, dấu cách và đưa về chữ hoa)
                        String targetCodeNormalized = invoice.getInvoiceCode().replaceAll("[- ]", "").toUpperCase();

                        for (Map<String, Object> tx : data) {
                            String content = (String) tx.get("transaction_content");
                            if (content == null) continue;

                            // Chuẩn hóa nội dung giao dịch nhận được từ ngân hàng
                            String contentNormalized = content.replaceAll("[- ]", "").toUpperCase();

                            if (contentNormalized.contains(targetCodeNormalized)) {
                                Object amountInObj = tx.get("amount_in");
                                double amountIn = 0;
                                if (amountInObj instanceof Number) {
                                    amountIn = ((Number) amountInObj).doubleValue();
                                }
                                if (amountIn >= invoice.getTotalAmount()) {
                                    invoice.setPaymentStatus(StatusPayment.PAID);
                                    invoice.setUpdatedAt(new Date());
                                    invoiceRepository.save(invoice);

                                    Order order = invoice.getOrder();
                                    if (order != null) {
                                        order.setStatusOrder(StatusOrdering.CONFIRMED);
                                        orderRepository.save(order);
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("[SePay Polling] Lỗi khi tự động kiểm tra giao dịch: " + e.getMessage());
        }
    }
}