package com.exam.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.exam.entity.exam.Category;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {
}
