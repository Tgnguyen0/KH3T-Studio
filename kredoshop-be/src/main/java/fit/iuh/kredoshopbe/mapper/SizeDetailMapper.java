package fit.iuh.kredoshopbe.mapper;

import fit.iuh.kredoshopbe.dto.response.SizeDetailResponse;
import fit.iuh.kredoshopbe.entities.SizeDetail;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SizeDetailMapper {
    SizeDetailResponse toSizeDetailMapper(SizeDetail sizeDetail);
}
