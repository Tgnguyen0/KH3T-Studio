package fit.iuh.kh3tshopbe.service;

import fit.iuh.kh3tshopbe.configuration.SePayConfig;
import fit.iuh.kh3tshopbe.dto.request.SePayRequest;
import fit.iuh.kh3tshopbe.dto.response.SePayResponse;
import fit.iuh.kh3tshopbe.entities.Invoice;
import fit.iuh.kh3tshopbe.enums.StatusPayment;
import fit.iuh.kh3tshopbe.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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
                // Bắt mã dạng cũ: INV20251206002
                Pattern pattern = Pattern.compile("(INV\\d{11,})");
                Matcher matcher = pattern.matcher(content);
                if (matcher.find()) {
                    invoiceCode = matcher.group(1);
                }
            }
        }
        if (invoiceCode != null && invoiceCode.matches("INV\\d{11,}")) {
            String datePart = invoiceCode.substring(3, 11);
            String indexPart = invoiceCode.substring(11);
            invoiceCode = "INV-" + datePart + "-" + indexPart;
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
