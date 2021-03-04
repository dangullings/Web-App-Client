package com.example.polls.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.polls.model.User_Student;

@Repository
public interface User_Student_Repo extends PagingAndSortingRepository<User_Student, Long> {

	@Query(
			value = "SELECT student_id FROM user_students us WHERE us.user_id = :userId",
			nativeQuery = true)
		List<Long> findAllStudentIdsByUserId(@Param("userId") long userId);
		
}
