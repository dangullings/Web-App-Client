package com.example.polls.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.example.polls.model.ClassSession;
import com.example.polls.model.Location;

@Repository
public interface LocationRepository extends PagingAndSortingRepository<Location, Long> {

	@Query(
    		value = "SELECT * FROM locations l WHERE l.name =:name",
    		nativeQuery = true)
    	Location findByName(String name);
	
}
