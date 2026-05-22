package fit.iuh.kredoshopbe.service;


import fit.iuh.kredoshopbe.dto.request.CartUpdateRequest;
import fit.iuh.kredoshopbe.dto.request.CartRequest;
import fit.iuh.kredoshopbe.dto.response.CartResponse;
import fit.iuh.kredoshopbe.entities.Account;
import fit.iuh.kredoshopbe.entities.Cart;
import fit.iuh.kredoshopbe.mapper.CartMapper;
import fit.iuh.kredoshopbe.repository.AccountRepository;
import fit.iuh.kredoshopbe.repository.CartDetailRepository;
import fit.iuh.kredoshopbe.repository.CartRepository;
import fit.iuh.kredoshopbe.repository.CustomerRepository;
import fit.iuh.kredoshopbe.entities.CartDetail;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor

public class CartService {
    CartRepository cartRepository;
    private final CustomerRepository customerRepository;
    AccountRepository accountRepository;
    CartDetailRepository cartDetailRepository;
    CartMapper  cartMapper;

    public Cart saveCart(Cart cart){
            return cartRepository.save(cart);
    }

    public Cart getCartByAccountId(int accountId) {
        Account account = accountRepository.findById(accountId).orElse(null);
        if (account == null) return null;
        Cart cart = cartRepository.findByAccount(account);
        if (cart == null) {
            cart = new Cart();
            cart.setCreated_at(new java.util.Date());
            cart.setUpdated_at(new java.util.Date());
            cart.setTotalAmount(0.0);
            cart.setTotalQuantity(0);
            cart.setAccount(account);
            cart = cartRepository.save(cart);
        } else {
            // Self-healing: recalculate totals from CartDetail to ensure correctness
            recalculateAndSaveCart(cart);
        }
        return cart;
    }
    public CartResponse updateCart(int cartId,CartRequest cartRequest) {
        Cart cart = cartRepository.findById(cartId).orElse(null);
        if (cart != null) {
            cart.setTotalQuantity(cart.getTotalQuantity() + cartRequest.getQuantity());
            cart.setTotalAmount(cart.getTotalAmount() + cartRequest.getTotalAmount());
            cartRepository.save(cart);
            recalculateAndSaveCart(cart);
        }
        return cartMapper.toCartResponse(cart);
    }
    public CartResponse updateCartIncrease(int cartId, CartUpdateRequest cartPriceRequest) {
        Cart cart = cartRepository.findById(cartId).orElse(null);
        if (cart != null) {
            cart.setTotalQuantity(cart.getTotalQuantity() + 1);
            cart.setTotalAmount(cart.getTotalAmount() + cartPriceRequest.getPrice());
            cartRepository.save(cart);
            recalculateAndSaveCart(cart);
        }
        return cartMapper.toCartResponse(cart);
    }

    public CartResponse updateCartDecrease(int cartId, CartUpdateRequest cartPriceRequest) {
        Cart cart = cartRepository.findById(cartId).orElse(null);
        if (cart != null) {
            int newQuantity = cart.getTotalQuantity() - 1;
            if (newQuantity <= 0) {
                cart.setTotalQuantity(0);
                cart.setTotalAmount(0.0);
            } else {
                cart.setTotalQuantity(newQuantity);
                double newAmount = cart.getTotalAmount() - cartPriceRequest.getPrice();
                if (newAmount < 0.0) newAmount = 0.0;
                cart.setTotalAmount(newAmount);
            }
            cartRepository.save(cart);
            recalculateAndSaveCart(cart);
        }
        return cartMapper.toCartResponse(cart);
    }

    public CartResponse updateCartDelete(int cartId, CartUpdateRequest cartPriceRequest) {
        Cart cart = cartRepository.findById(cartId).orElse(null);
        if (cart != null) {
            int newQuantity = cart.getTotalQuantity() - cartPriceRequest.getQuantity();
            if (newQuantity <= 0) {
                cart.setTotalQuantity(0);
                cart.setTotalAmount(0.0);
            } else {
                cart.setTotalQuantity(newQuantity);
                double newAmount = cart.getTotalAmount() - cartPriceRequest.getPrice();
                if (newAmount < 0.0) newAmount = 0.0;
                cart.setTotalAmount(newAmount);
            }
            cartRepository.save(cart);
            recalculateAndSaveCart(cart);
        }
        return cartMapper.toCartResponse(cart);
    }

    private void recalculateAndSaveCart(Cart cart) {
        if (cart == null) return;
        List<CartDetail> details = cartDetailRepository.findByCart(cart);
        int totalQuantity = 0;
        double totalAmount = 0.0;
        if (details != null) {
            for (CartDetail detail : details) {
                totalQuantity += detail.getQuantity();
                totalAmount += detail.getSubtotal();
            }
        }
        cart.setTotalQuantity(totalQuantity);
        cart.setTotalAmount(totalAmount);
        cartRepository.save(cart);
    }

}
