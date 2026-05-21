package fit.iuh.kredoshopbe.service;

import fit.iuh.kredoshopbe.dto.request.SizeDetailRequest;
import fit.iuh.kredoshopbe.dto.response.SizeDetailResponse;
import fit.iuh.kredoshopbe.entities.Product;
import fit.iuh.kredoshopbe.entities.Size;
import fit.iuh.kredoshopbe.entities.SizeDetail;
import fit.iuh.kredoshopbe.exception.AppException;
import fit.iuh.kredoshopbe.exception.ErrorCode;
import fit.iuh.kredoshopbe.mapper.SizeDetailMapper;
import fit.iuh.kredoshopbe.repository.ProductRepository;
import fit.iuh.kredoshopbe.repository.SizeDetailRepository;
import fit.iuh.kredoshopbe.repository.SizeRepository;
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