package fit.iuh.kh3tshopbe.service;

import fit.iuh.kh3tshopbe.entities.Product;
import fit.iuh.kh3tshopbe.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductCacheService {

    private final ProductRepository productRepository;

    // Cache danh sách sản phẩm đã load đầy đủ (fetch join tất cả quan hệ)
    private List<Product> cachedProducts = null;
    private long lastUpdated = 0L;
    private static final long CACHE_TTL = 10 * 60 * 1000; // 10 phút

    public ProductCacheService(ProductRepository productRepository) {
        this.productRepository = productRepository;
        refreshCache(); // Load lần đầu khi khởi động
    }

    public synchronized List<Product> getAllProducts() {
        if (cachedProducts == null || System.currentTimeMillis() - lastUpdated > CACHE_TTL) {
            refreshCache();
        }
        return cachedProducts;
    }

    public synchronized void refreshCache() {
        System.out.println("Refreshing product cache...");
        this.cachedProducts = productRepository.findAllWithDetails(); // JOIN FETCH 1 lần duy nhất
        this.lastUpdated = System.currentTimeMillis();
        System.out.println("Product cache refreshed: " + cachedProducts.size() + " items");
    }
}