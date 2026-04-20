package fit.iuh.kh3tshopbe.dto.request;

import fit.iuh.kh3tshopbe.entities.*;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductRequest {
     int id;
     String name;
     String description;
     double price;
     String unit;
     String imageUrlFront;
     String imageUrlBack;
     CategoryRequest categoryRequest;
     double discountAmount;
     String material;
     String form;
     List<SizeDetailRequest> sizeDetailRequests;
}
