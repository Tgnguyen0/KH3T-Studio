package fit.iuh.kredoshopbe.service;

import fit.iuh.kredoshopbe.dto.request.OrderDetailRequest;
import fit.iuh.kredoshopbe.dto.response.OrderDetailResponse;
import fit.iuh.kredoshopbe.entities.Order;
import fit.iuh.kredoshopbe.entities.OrderDetail;
import fit.iuh.kredoshopbe.entities.Product;
import fit.iuh.kredoshopbe.mapper.OrderDetailMapper;
import fit.iuh.kredoshopbe.repository.OrderDetailRepository;
import fit.iuh.kredoshopbe.repository.OrderRepository;
import fit.iuh.kredoshopbe.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor

public class OrderDetailService {
    OrderDetailRepository orderDetailRepository;
    ProductRepository productRepository;
    OrderRepository orderRepository;
    OrderDetailMapper orderDetailMapper;

    public OrderDetailResponse createOrderDetail(OrderDetailRequest orderDetailRequest) {
        Product product = productRepository.findById(orderDetailRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        Order order = orderRepository.findById(orderDetailRequest.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setProduct(product);
        orderDetail.setOrder(order);
        orderDetail.setProductName(orderDetailRequest.getProductName());
        orderDetail.setQuantity(orderDetailRequest.getQuantity());
        orderDetail.setCreated_at(new Date());
        orderDetail.setUpdated_at(new Date());
        orderDetail.setTotalPrice(orderDetailRequest.getTotalPrice());
        orderDetail.setUnitPrice(orderDetailRequest.getUnitPrice());

        OrderDetail saved = orderDetailRepository.save(orderDetail);

        return orderDetailMapper.toOrderDetailResponse(saved);

    }
}
