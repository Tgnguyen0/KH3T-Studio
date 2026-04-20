package fit.iuh.kh3tshopbe.service;

import fit.iuh.kh3tshopbe.dto.request.OrderDetailRequest;
import fit.iuh.kh3tshopbe.dto.response.OrderDetailResponse;
import fit.iuh.kh3tshopbe.dto.response.OrderResponse;
import fit.iuh.kh3tshopbe.entities.Order;
import fit.iuh.kh3tshopbe.entities.OrderDetail;
import fit.iuh.kh3tshopbe.entities.Product;
import fit.iuh.kh3tshopbe.mapper.OrderDetailMapper;
import fit.iuh.kh3tshopbe.repository.OrderDetailRepository;
import fit.iuh.kh3tshopbe.repository.OrderRepository;
import fit.iuh.kh3tshopbe.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

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
