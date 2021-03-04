package com.example.polls.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.example.polls.model.ClassDate;
import com.example.polls.model.Test;

@Repository
public interface TestRepository extends PagingAndSortingRepository<Test, Long> {
    Optional<Test> findById(Long testId);

    @Query(
    		value = "SELECT * FROM tests t WHERE t.month =:month AND t.year =:year",
    		nativeQuery = true)
    	Page<Test> findAllByMonthYear(Pageable pageable, String month, String year);
    
	@Query(
			value = "SELECT * FROM tests t ORDER BY t.date DESC",
			nativeQuery = true)
		Page<Test> findAllOrderByDate(Pageable pageable);
}