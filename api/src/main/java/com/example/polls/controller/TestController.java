package com.example.polls.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.polls.model.ClassDate;
import com.example.polls.model.Item;
import com.example.polls.model.Student;
import com.example.polls.model.Test;
import com.example.polls.model.Test_Student;
import com.example.polls.service.TestService;

@RestController
@RequestMapping("/api/tests")
public class TestController {
    
    @Autowired
	private TestService testService;

    @GetMapping("/search/month/{month}/year/{year}")
    public ResponseEntity<Page<Test>> findAllByMonthYear(Pageable pageable, @PathVariable String month, @PathVariable String year) {
    	System.out.println("test controller month "+month+" year "+year);
		return new ResponseEntity<>(testService.findAllByMonthYear(pageable, month, year), HttpStatus.OK);
	}
    
    @GetMapping
	public ResponseEntity<Page<Test>> findAllOrderByDate(Pageable pageable) {
		return new ResponseEntity<>(testService.findAllOrderByDate(pageable), HttpStatus.OK);
	}

    @GetMapping("{id}")
	public ResponseEntity<Test> findById(@PathVariable Long id) {
		return new ResponseEntity<>(testService.findById(id), HttpStatus.OK);
	}

	@PostMapping("/saveTest")
	public ResponseEntity<Test> save(@RequestBody Test test) {
		return new ResponseEntity<>(testService.saveOrUpdate(test), HttpStatus.CREATED);
	}

	@DeleteMapping("{id}")
	public ResponseEntity<String> deleteById(@PathVariable Long id) {
		return new ResponseEntity<>(testService.deleteById(id), HttpStatus.OK);
	}

}
