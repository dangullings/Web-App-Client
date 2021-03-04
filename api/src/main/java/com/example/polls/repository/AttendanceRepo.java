package com.example.polls.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.polls.model.Attendance;

@Repository
public interface AttendanceRepo extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findById(Long attendanceId);
    
	@Query(
			value = "SELECT * FROM attendance a WHERE a.class_date_id = :classDateId and a.student_id = :studentId",
			nativeQuery = true)
		Attendance findByClassDateIdAndStudentId(@Param("classDateId") Long classDateId, @Param("studentId") Long studentId);
}
