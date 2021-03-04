package com.example.polls.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.polls.model.Rank;
import com.example.polls.service.RankService;

@RestController
@RequestMapping("/api/ranks")
public class RankController {
    
    @Autowired
	private RankService rankService;

    @GetMapping
	public ResponseEntity<Page<Rank>> findAll(Pageable pageable) {
		return new ResponseEntity<>(rankService.findAll(pageable), HttpStatus.OK);
	}

	@GetMapping("{id}")
	public ResponseEntity<Rank> findById(Long id) {
		return new ResponseEntity<>(rankService.findById(id), HttpStatus.OK);
	}

	@PostMapping("/saveRank")
	public ResponseEntity<Rank> save(@RequestBody Rank rank) {
		return new ResponseEntity<>(rankService.saveOrUpdate(rank), HttpStatus.CREATED);
	}

	@PutMapping()
	public ResponseEntity<Rank> update(Rank rank) {
		return new ResponseEntity<>(rankService.saveOrUpdate(rank), HttpStatus.OK);
	}

	@DeleteMapping("{id}")
	public ResponseEntity<String> deleteById(Long id) {
		return new ResponseEntity<>(rankService.deleteById(id), HttpStatus.OK);
	}
}