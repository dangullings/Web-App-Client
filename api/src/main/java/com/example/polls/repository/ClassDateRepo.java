package com.example.polls.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.polls.model.ClassDate;

@Repository
public interface ClassDateRepo extends JpaRepository<ClassDate, Long> {
    Optional<ClassDate> findById(Long classDateId);
    
    @Query(
    		value = "SELECT * FROM class_dates cd WHERE cd.month =:month AND cd.year =:year",
    		nativeQuery = true)
    	Page<ClassDate> findAllByMonthYear(Pageable pageable, String month, String year);
    
    @Query(
    		value = "SELECT * FROM class_dates cd WHERE cd.month =:month AND cd.year =:year AND cd.session_id =:session",
    		nativeQuery = true)
    List<ClassDate> findAllByMonthYearAndSession(String month, String year, long session);
    
    @Query(
    		value = "SELECT * FROM class_dates cd WHERE cd.session_id =:sessionId ORDER BY cd.date ASC",
    		nativeQuery = true)
    	List<ClassDate> findAllBySessionId(Long sessionId);
}
