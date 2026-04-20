// Updated ProductController.java
package fit.iuh.kh3tshopbe.controller;

import fit.iuh.kh3tshopbe.dto.request.ProductRequest;

import fit.iuh.kh3tshopbe.dto.response.ApiResponse;
import fit.iuh.kh3tshopbe.dto.response.ProductResponse;

import fit.iuh.kh3tshopbe.dto.response.TopProductResponse;
import fit.iuh.kh3tshopbe.service.ProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {
    ProductService productService;

    @GetMapping
    public ApiResponse<List<ProductResponse>> getAllProducts() {
        ApiResponse<List<ProductResponse>> response = new ApiResponse<>();
        response.setResult(productService.getAllProducts());
        return response;
    }


    // THÊM: Endpoint cho chi tiết sản phẩm theo ID
    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProductById(@PathVariable int id) {
        ApiResponse<ProductResponse> response = new ApiResponse<>();
        response.setResult(productService.getProductById(id));
        return response;
    }
    @GetMapping("/batch")
    public ApiResponse<List<ProductResponse>> getProductsByIds(@RequestParam("ids") List<Integer> ids) {
        ApiResponse<List<ProductResponse>> response = new ApiResponse<>();

        if (ids == null || ids.isEmpty()) {
            // Trả về danh sách rỗng nếu không có ID nào
            response.setResult(Collections.emptyList());
            return response;
        }

        // Gọi tầng Service để lấy danh sách sản phẩm
        response.setResult(productService.getProductsByIds(ids));
        return response;
    }
    @PostMapping
    public ApiResponse<ProductResponse> createProduct(@RequestBody ProductRequest productRequest) {
//        ApiResponse<ProductResponse> response = new ApiResponse<>();
//        response.setResult(productService.createProduct(productRequest));
//        return response;
        ApiResponse<ProductResponse> response = new ApiResponse<>();
        response.setResult(productService.createProduct(productRequest));
        return response;
    }

    @PutMapping("/{id}")
    public ApiResponse<ProductResponse> updateProduct(@PathVariable int id, @RequestBody ProductRequest productRequest) {
        ApiResponse<ProductResponse> response = new ApiResponse<>();
        response.setResult(productService.updateProduct(id, productRequest));
        return response;
    }
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteProduct(@PathVariable int id) {
        productService.deleteProduct(id);
        ApiResponse<String> response = new ApiResponse<>();
        response.setResult("Product deleted successfully");
        return response;
    }


    @GetMapping("/top-trending")
    public List<TopProductResponse> getTopTrending(
            @RequestParam(defaultValue = "week") String type) {
        return productService.getTopTrending(type);
    }

    @GetMapping("/stats")
    public ApiResponse<?> getStats() {
        return ApiResponse.<Object>builder()
                .result(productService.getDashboardStats())
                .build();
    }


}

