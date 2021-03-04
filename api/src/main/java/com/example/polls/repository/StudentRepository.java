package com.example.polls.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.polls.model.Student;

import antlr.collections.List;

@Repository
public interface StudentRepository extends PagingAndSortingRepository<Student, Long> {

	@Query(
		value = "SELECT * FROM students s WHERE s.active =:active AND s.first_name LIKE :searchText% OR s.last_name LIKE :searchText%"
				+ " ORDER BY s.joined DESC",
		nativeQuery = true)
	Page<Student> findAll(Pageable pageable, String searchText, boolean active);
	
	@Query(
		value = "SELECT * FROM Students s WHERE s.active =:active ORDER BY s.joined DESC",
		nativeQuery = true)
	Page<Student> findAllByActive(Pageable pageable, boolean active);

}