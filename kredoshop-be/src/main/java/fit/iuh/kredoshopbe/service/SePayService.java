package fit.iuh.kredoshopbe.service;

import fit.iuh.kredoshopbe.configuration.SePayConfig;
import fit.iuh.kredoshopbe.dto.request.SePayRequest;
import fit.iuh.kredoshopbe.dto.response.SePayResponse;
import fit.iuh.kredoshopbe.entities.Invoice;
import fit.iuh.kredoshopbe.enums.StatusPayment;
import fit.iuh.kredoshopbe.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class SePayService {

    @Autowired
    private SePayConfig sePayConfig;

    @Autowired
    private InvoiceRepository invoiceRepository;

    public SePayResponse handleCallback(SePayRequest callbackRequest, String authorizationHeader) {
        if (!sePayConfig.getApiKey().equals(authorizationHeader)) {
            return new SePayResponse(false, "Unauthorized callback " + authorizationHeader);
        }
        if (!"in".equalsIgnoreCase(callbackRequest.getTransferType())) {
            return new SePayResponse(true, "Transaction type not supported");
        }
        String invoiceCode = callbackRequest.getCode();
        if (invoiceCode == null || invoiceCode.isEmpty()) {
            String content = callbackRequest.getContent();

            if (content != null && !content.isEmpty()) {
                // Bắt mã có/không có dấu gạch ngang hoặc dấu cách: ví dụ INV-20260521-001, INV 20260521 001, INV20260521001
                Pattern pattern = Pattern.compile("(INV[- ]?\\d{8}[- ]?\\d+)", Pattern.CASE_INSENSITIVE);
                Matcher matcher = pattern.matcher(content);
                if (matcher.find()) {
                    invoiceCode = matcher.group(1);
                }
            }
        }
        if (invoiceCode != null) {
            // Chuẩn hóa: loại bỏ khoảng trắng, chuyển thành chữ hoa
            invoiceCode = invoiceCode.replaceAll("\\s+", "").toUpperCase();

            // Nếu là dạng không dấu gạch ngang (INV20260521001), chuyển thành dạng có dấu (INV-20260521-001)
            if (invoiceCode.matches("INV\\d{11,}")) {
                String datePart = invoiceCode.substring(3, 11);
                String indexPart = invoiceCode.substring(11);
                invoiceCode = "INV-" + datePart + "-" + indexPart;
            } else if (invoiceCode.matches("INV-\\d{8}\\d+")) {
                // Dạng lai như INV-20260521001 -> INV-20260521-001
                String datePart = invoiceCode.substring(4, 12);
                String indexPart = invoiceCode.substring(12);
                invoiceCode = "INV-" + datePart + "-" + indexPart;
            } else if (invoiceCode.matches("INV\\d{8}-\\d+")) {
                // Dạng lai như INV20260521-001 -> INV-20260521-001
                String datePart = invoiceCode.substring(3, 11);
                String indexPart = invoiceCode.substring(12);
                invoiceCode = "INV-" + datePart + "-" + indexPart;
            }
        }
        Invoice invoice = invoiceRepository.findByInvoiceCode(invoiceCode);
        if (invoice == null) {
            return new SePayResponse(true, "Invoice not found");
        }
        if (callbackRequest.getTransferAmount() < invoice.getTotalAmount()) {
            return new SePayResponse(true, "Payment amount insufficient");
        }
        invoice.setPaymentStatus(StatusPayment.PAID);
        invoiceRepository.save(invoice);
        System.out.println(invoice);

        return new SePayResponse(true, "Payment processed successfully");
    }
}
