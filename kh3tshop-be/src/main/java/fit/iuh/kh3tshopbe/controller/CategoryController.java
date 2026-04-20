package fit.iuh.kh3tshopbe.controller;

import fit.iuh.kh3tshopbe.dto.response.ApiResponse;
import fit.iuh.kh3tshopbe.dto.response.CategoryResponse;
import fit.iuh.kh3tshopbe.service.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {

    CategoryService categoryService;

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAllCategories() {
        ApiResponse<List<CategoryResponse>> response = new ApiResponse<>();
        response.setResult(categoryService.getAllCategories());
        return response;
    }

    @GetMapping("/category-revenue")
    public Map<String, Object> getCategoryRevenue() {
        return Map.of(
                "code", 200,
                "result", categoryService.getCategoryReport()
        );
    }
}
