package fit.iuh.kh3tshopbe.controller;

import fit.iuh.kh3tshopbe.dto.request.CreateInvoiceRequest;
import fit.iuh.kh3tshopbe.dto.response.InvoiceResponse;
import fit.iuh.kh3tshopbe.dto.response.OrderResponse;


import fit.iuh.kh3tshopbe.dto.response.PaymentStatisticResponse;

import fit.iuh.kh3tshopbe.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;



@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InvoiceController {
    InvoiceService invoiceService;

    @GetMapping
    public List<InvoiceResponse> getAllInvoices() {
        return invoiceService.getAllInvoices();
    }

    @PostMapping
    public ResponseEntity<InvoiceResponse> createInvoice(@Valid @RequestBody CreateInvoiceRequest request) {
        InvoiceResponse response = invoiceService.createInvoice(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @GetMapping("/week")
    public List<Map<String, Object>> getProfitByWeek() {
        LocalDate today = LocalDate.now();
        LocalDate start = today.with(DayOfWeek.MONDAY);
        LocalDate end = today.with(DayOfWeek.SUNDAY);
        return invoiceService.getProfitWeekly(start, end);
    }

    @GetMapping("/month")
    public List<Map<String, Object>> getProfitByMonth() {
        LocalDate today = LocalDate.now();
        LocalDate start = today.withDayOfMonth(1);
        LocalDate end = today.withDayOfMonth(today.lengthOfMonth());
        return invoiceService.getProfitMonthly(start, end);
    }

    @GetMapping("/year")
    public List<Map<String, Object>> getProfitByYear() {
        LocalDate today = LocalDate.now();
        LocalDate start = today.withDayOfYear(1);
        LocalDate end = today.withDayOfYear(today.lengthOfYear());
        return invoiceService.getProfitYearly(start, end);
    }

    @GetMapping("/payment")
    public List<PaymentStatisticResponse> getPaymentStatistics() {
        return invoiceService.getPaymentStatistics();
    }

    @GetMapping("/{id}")
    public InvoiceResponse getInvoice(@PathVariable int id) {
        return invoiceService.getInvoiceById(id);
    }
}
