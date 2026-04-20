package fit.iuh.kh3tshopbe.service;

import fit.iuh.kh3tshopbe.dto.request.CartDetailRequest;
import fit.iuh.kh3tshopbe.dto.response.CartDetailResponse;

import fit.iuh.kh3tshopbe.dto.response.SizeDetailResponse;
import fit.iuh.kh3tshopbe.entities.Cart;
import fit.iuh.kh3tshopbe.entities.CartDetail;
import fit.iuh.kh3tshopbe.entities.Product;
import fit.iuh.kh3tshopbe.entities.SizeDetail;
import fit.iuh.kh3tshopbe.exception.AppException;
import fit.iuh.kh3tshopbe.exception.ErrorCode;

import fit.iuh.kh3tshopbe.mapper.CartDetailMapper;
import fit.iuh.kh3tshopbe.repository.CartDetailRepository;
import fit.iuh.kh3tshopbe.repository.CartRepository;
import fit.iuh.kh3tshopbe.repository.ProductRepository;


import fit.iuh.kh3tshopbe.repository.SizeDetailRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import javax.management.RuntimeErrorException;
import java.util.Date;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class CartDetailService {
    CartDetailRepository cartDetailRepository;
    CartDetailMapper cartDetailMapper;
    ProductRepository productRepository;
    CartRepository cartRepository;
    SizeDetailRepository sizeDetailRepository;

    public CartDetailResponse addCartDetail(CartDetailRequest cartDetailRequest) {
        Product product = productRepository.findById(cartDetailRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        Cart cart = cartRepository.findById(cartDetailRequest.getCartId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        SizeDetail sizeDetail = sizeDetailRepository.findById(cartDetailRequest.getSizeDetailId())
                .orElseThrow(() -> new RuntimeException("Size not found"));
        CartDetail existing = cartDetailRepository.findByCartAndProductAndSizeDetail(cart, product, sizeDetail);

        if (existing != null) {
            int newQuantity = existing.getQuantity() + cartDetailRequest.getQuantity();
            existing.setQuantity(newQuantity);
            existing.setSubtotal(existing.getPrice_at_time() * newQuantity);
            existing.setUpdateAt(new Date());
            CartDetail updated = cartDetailRepository.save(existing);
            return cartDetailMapper.toCartDetailResponse(updated);
        }
        CartDetail cartDetail = new CartDetail();
        cartDetail.setProduct(product);
        cartDetail.setCart(cart);


        cartDetail.setSizeDetail(sizeDetail);
        cartDetail.setQuantity(cartDetailRequest.getQuantity() > 0 ? cartDetailRequest.getQuantity() : 1);
        cartDetail.setSelected(false);
        cartDetail.setUpdateAt(null);
        cartDetail.setCreateAt(new Date());
        cartDetail.setSubtotal(product.getPrice()* cartDetail.getQuantity());
        cartDetail.setPrice_at_time(product.getPrice());

        CartDetail saved = cartDetailRepository.save(cartDetail);

        return cartDetailMapper.toCartDetailResponse(saved);
    }

    public List<CartDetailResponse> getCartDetailListByCardId(int cartId){
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        List<CartDetail> cartDetailList = cartDetailRepository.findByCart(cart);

        return cartDetailList
                .stream()
                .map(cartDetailMapper::toCartDetailResponse)
                .toList();
    }

    public CartDetailResponse updateCartDetailSelected(int cartDetailId, boolean selected) {
        CartDetail cartDetail = cartDetailRepository.findById(cartDetailId)
                .orElseThrow(() -> new RuntimeException("CartDetail not found"));
        cartDetail.setSelected(selected);
        cartDetail.setUpdateAt(new Date());
        CartDetail updated = cartDetailRepository.save(cartDetail);
        return cartDetailMapper.toCartDetailResponse(updated);
    }

    public CartDetailResponse updateCartDetailIncreaseQuantity(int cartDetailId){
        CartDetail cartDetail = cartDetailRepository
                .findById(cartDetailId)
                .orElseThrow(() -> new RuntimeException("CartDetail not found"));
        cartDetail.setQuantity(cartDetail.getQuantity() + 1);
        cartDetail.setSubtotal(cartDetail.getPrice_at_time() * cartDetail.getQuantity());
        cartDetail.setUpdateAt(new Date());
        CartDetail updated = cartDetailRepository.save(cartDetail);
        return cartDetailMapper.toCartDetailResponse(updated);
    }

    public CartDetailResponse updateCartDetailDecreaseQuantity(int cartDetailId){
        CartDetail cartDetail = cartDetailRepository
                .findById(cartDetailId)
                .orElseThrow(() -> new RuntimeException("CartDetail not found"));
        cartDetail.setQuantity(cartDetail.getQuantity() - 1);
//        if(cartDetail.getQuantity() <= 0){
//            deleteCartDetail(cartDetailId);
//            return null;
//        }
        cartDetail.setSubtotal(cartDetail.getPrice_at_time() * cartDetail.getQuantity());
        cartDetail.setUpdateAt(new Date());
        CartDetail updated = cartDetailRepository.save(cartDetail);
        return cartDetailMapper.toCartDetailResponse(updated);
    }

    public void deleteCartDetail(int cartDetailId) {
        CartDetail cartDetail = cartDetailRepository.findById(cartDetailId)
                .orElseThrow(() -> new RuntimeException("CartDetail not found"));
        cartDetailRepository.delete(cartDetail);
    }

    public List<CartDetailResponse> getCartDetailIsSelected(int cartId){
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        List<CartDetail> selectedList = cartDetailRepository.findByIsSelectedAndCart(true, cart);
        return selectedList.stream()
                .map(cartDetailMapper::toCartDetailResponse)
                .toList();
    }
}

