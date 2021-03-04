package com.example.polls.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.polls.model.ClassSession;
import com.example.polls.model.Test_Student;

@Repository
public interface Test_StudentRepository extends PagingAndSortingRepository<Test_Student, Long> {
    Optional<Test_Student> findById(Long test_studentId);
    
	@Query(
			value = "SELECT * FROM test_student ts WHERE ts.test_id = :testId and ts.student_id = :studentId",
			nativeQuery = true)
		Test_Student findByTestIdAndStudentId(@Param("testId") Long testId, @Param("studentId") Long studentId);
	
	@Modifying
    @Transactional
	@Query(
			value = "DELETE FROM test_student ts WHERE ts.test_id = :testId",
			nativeQuery = true)
		void deleteAllByTestId(@Param("testId") Long testId);
	
	@Modifying
    @Transactional
	@Query(
			value = "DELETE FROM test_student ts WHERE ts.test_id = :testId AND ts.student_id = :studentId",
			nativeQuery = true)
		void deleteAllByTestIdAndStudentId(@Param("testId") Long testId, @Param("studentId") Long studentId);
		
	@Query(
			value = "SELECT * FROM test_student ts WHERE ts.student_id = :studentId",
			nativeQuery = true)
		Page<Test_Student> findAllByStudentId(Pageable pageable, @Param("studentId") Long studentId);
		
		@Query(
	    		value = "SELECT student_id FROM test_student ts WHERE ts.test_id =:testId",
	    		nativeQuery = true)
	    	List<Long> findAllByTestId(Long testId);

		@Query(
	    		value = "SELECT test_id FROM test_student ts WHERE ts.student_id =:studentId",
	    		nativeQuery = true)
	    	List<Long> findAllByStudentId(Long studentId);
}
