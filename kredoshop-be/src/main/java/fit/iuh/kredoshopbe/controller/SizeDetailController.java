package fit.iuh.kredoshopbe.controller;

import fit.iuh.kredoshopbe.dto.request.SizeDetailRequest;
import fit.iuh.kredoshopbe.dto.response.SizeDetailResponse;
import fit.iuh.kredoshopbe.service.SizeDetailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/size-details")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SizeDetailController {
    SizeDetailService sizeDetailService;

    @GetMapping("/find")
    public SizeDetailResponse getSizeDetailByProductAndSize(@RequestParam("productId") int productId,
                                                            @RequestParam("sizeId") int sizeId) {
        SizeDetailRequest request = SizeDetailRequest.builder()
                .productId(productId)
                .sizeId(sizeId)
                .build();
        return sizeDetailService.findByProductAndSize(request);
    }
}