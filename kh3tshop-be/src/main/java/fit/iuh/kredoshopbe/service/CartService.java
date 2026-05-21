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

        return cartRepository.findByAccount(account);
    }
    public CartResponse updateCart(int cartId,CartRequest cartRequest) {
        Cart cart = cartRepository.findById(cartId).orElse(null);
        cart.setTotalQuantity(cart.getTotalQuantity()    + cartRequest.getQuantity());
        cart.setTotalAmount(cart.getTotalAmount() + cartRequest.getTotalAmount());
        cartRepository.save(cart);
        return cartMapper.toCartResponse(cart);
    }
    public CartResponse updateCartIncrease(int cartId, CartUpdateRequest cartPriceRequest) {
        Cart cart = cartRepository.findById(cartId).orElse(null);
        cart.setTotalQuantity(cart.getTotalQuantity() + 1);
        cart.setTotalAmount(cart.getTotalAmount() + cartPriceRequest.getPrice());
        cartRepository.save(cart);
        return cartMapper.toCartResponse(cart);
    }

    public CartResponse updateCartDecrease(int cartId, CartUpdateRequest cartPriceRequest) {
        Cart cart = cartRepository.findById(cartId).orElse(null);
        cart.setTotalQuantity(cart.getTotalQuantity() - 1);
        if(cart.getTotalQuantity() > 0){
            cart.setTotalAmount(cart.getTotalAmount() - cartPriceRequest.getPrice());
        }else {
            cart.setTotalQuantity(0);
        }
        cart.setTotalAmount(cart.getTotalAmount() - cartPriceRequest.getPrice());
        cartRepository.save(cart);
        return cartMapper.toCartResponse(cart);
    }

    public CartResponse updateCartDelete(int cartId, CartUpdateRequest cartPriceRequest) {
        Cart cart = cartRepository.findById(cartId).orElse(null);
        cart.setTotalQuantity(cart.getTotalQuantity() - cartPriceRequest.getQuantity());
        if(cart.getTotalQuantity() > 0) {
            cart.setTotalAmount(cart.getTotalAmount() - cartPriceRequest.getPrice());
        }else {
            cart.setTotalQuantity(0);
        }
        cartRepository.save(cart);
        return cartMapper.toCartResponse(cart);
    }

}
