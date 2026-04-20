package fit.iuh.kh3tshopbe.service;

import fit.iuh.kh3tshopbe.dto.request.SizeDetailRequest;
import fit.iuh.kh3tshopbe.dto.request.SizeRequest;
import fit.iuh.kh3tshopbe.dto.response.SizeDetailResponse;
import fit.iuh.kh3tshopbe.entities.Product;
import fit.iuh.kh3tshopbe.entities.Size;
import fit.iuh.kh3tshopbe.entities.SizeDetail;
import fit.iuh.kh3tshopbe.exception.AppException;
import fit.iuh.kh3tshopbe.exception.ErrorCode;
import fit.iuh.kh3tshopbe.mapper.SizeDetailMapper;
import fit.iuh.kh3tshopbe.repository.ProductRepository;
import fit.iuh.kh3tshopbe.repository.SizeDetailRepository;
import fit.iuh.kh3tshopbe.repository.SizeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor

public class SizeDetailService {
    SizeDetailRepository sizeDetailRepository;
    ProductRepository productRepository;
    SizeRepository sizeRepository;
    SizeDetailMapper sizeDetailMapper;

    public SizeDetailResponse findByProductAndSize(SizeDetailRequest sizeDetailRequest) {
        Product product =  productRepository.findById(sizeDetailRequest.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        Size size = sizeRepository.findById(sizeDetailRequest.getSizeId())
                .orElseThrow(() -> new AppException(ErrorCode.SIZE_NOT_FOUND));

        SizeDetail sizeDetail = sizeDetailRepository.findSizeDetailByProductAndSize(product, size);

        return sizeDetailMapper.toSizeDetailMapper(sizeDetail);
    }

    public SizeDetailResponse findById(int sizeId) {
         SizeDetail sizeDetail = sizeDetailRepository.findById(sizeId)
                 .orElseThrow(() -> new AppException(ErrorCode.SIZE_DETAIL_NOT_FOUND));

         return sizeDetailMapper.toSizeDetailMapper(sizeDetail);
    }
}