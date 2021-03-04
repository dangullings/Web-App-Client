package com.example.polls.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.example.polls.model.ClassDate;
import com.example.polls.model.ClassSession;
import com.example.polls.model.CalendarEvent;

@Repository
public interface EventRepo extends JpaRepository<CalendarEvent, Long> {

	@Query(
    		value = "SELECT * FROM calendar_events e WHERE e.month =:month AND e.year =:year",
    		nativeQuery = true)
    	Page<CalendarEvent> findAllByMonthYear(Pageable pageable, String month, String year);
	
	@Query(
    		value = "SELECT * FROM calendar_events e ORDER BY e.date DESC LIMIT 10",
    		nativeQuery = true)
    	List<CalendarEvent> findAllByDate();
}
