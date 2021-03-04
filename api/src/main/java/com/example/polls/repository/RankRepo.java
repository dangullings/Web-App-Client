package com.example.polls.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.polls.model.Rank;

@Repository
public interface RankRepo extends PagingAndSortingRepository<Rank, Long> {
    Optional<Rank> findById(Long rankId);
    
    @GetMapping
	Page<Rank> findAll(Pageable pageable);
}
