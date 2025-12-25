// backend/src/main/java/com/civicpulse/repository/ComplaintCategoryRepository.java
package com.civicpulse.repository;

import com.civicpulse.model.ComplaintCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintCategoryRepository extends JpaRepository<ComplaintCategory, Long> {
    List<ComplaintCategory> findAllByOrderByCategoryNameAsc();
}