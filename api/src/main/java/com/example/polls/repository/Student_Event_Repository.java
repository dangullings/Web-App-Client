package com.example.polls.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import com.example.polls.model.CalendarEvent_Student;

public interface Student_Event_Repository extends PagingAndSortingRepository<CalendarEvent_Student, Long> {
	Optional<CalendarEvent_Student> findById(Long studentSessionId);
	
	@Query(
			value = "SELECT * FROM calendar_events_students ces WHERE ces.student_id = :studentId",
			nativeQuery = true)
		List<CalendarEvent_Student> findAllByStudentId(@Param("studentId") Long studentId);
		
		@Query(
				value = "SELECT student_id FROM calendar_events_students ces WHERE ces.calendar_event_id = :eventId",
				nativeQuery = true)
			List<Long> findAllByCalendarEventId(@Param("eventId") long eventId);
}
