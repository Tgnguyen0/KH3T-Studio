package fit.iuh.kh3tshopbe.controller;

import fit.iuh.kh3tshopbe.entities.Size;
import fit.iuh.kh3tshopbe.service.SizeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/sizes")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SizeController {
    SizeService sizeService;

    @GetMapping
    public List<Size> getAllSizes() {
        return sizeService.getAllSizes();
    }


    @GetMapping("/{name}")
    public Size getSizeByName(@PathVariable String name) {
        return sizeService.getSizeByName(name);
    }
}