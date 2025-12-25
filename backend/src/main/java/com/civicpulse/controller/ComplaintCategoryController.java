// backend/src/main/java/com/civicpulse/controller/ComplaintCategoryController.java
package com.civicpulse.controller;

import com.civicpulse.model.ComplaintCategory;
import com.civicpulse.repository.ComplaintCategoryRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class ComplaintCategoryController {

    private final ComplaintCategoryRepository categoryRepository;

    public ComplaintCategoryController(ComplaintCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ResponseEntity<List<ComplaintCategory>> getAllCategories() {
        List<ComplaintCategory> categories = categoryRepository.findAllByOrderByCategoryNameAsc();
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    // @PreAuthorize("hasRole('ADMIN')") // Comment out or remove this for now
    public ResponseEntity<ComplaintCategory> createCategory(@RequestBody ComplaintCategory category) {
        ComplaintCategory savedCategory = categoryRepository.save(category);
        return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
    }
}