package fit.iuh.kh3tshopbe.service;

import fit.iuh.kh3tshopbe.dto.response.CategoryResponse;
import fit.iuh.kh3tshopbe.dto.response.CategoryRevenueResponse;
import fit.iuh.kh3tshopbe.entities.Category;
import fit.iuh.kh3tshopbe.repository.CategoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryService {

    CategoryRepository categoryRepository;
    private final List<String> colors = List.of(
            "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b",
            "#10b981", "#3b82f6", "#ef4444", "#14b8a6"
    );
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::convertToCategoryResponse)
                .collect(Collectors.toList());
    }

    private CategoryResponse convertToCategoryResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .build();
    }



    public List<CategoryRevenueResponse> getCategoryReport() {
        List<Object[]> raw = categoryRepository.getRevenueByCategory();

        List<CategoryRevenueResponse> result = new ArrayList<>();

        Random rand = new Random();

        for (Object[] r : raw) {
            String name = (String) r[0];
            long productCount = ((Number) r[1]).longValue();
            double revenue = ((Number) r[2]).doubleValue();

            String color = colors.get(rand.nextInt(colors.size()));

            result.add(new CategoryRevenueResponse(
                    name, productCount, revenue, color
            ));
        }

        return result;
    }
}
