package com.example.polls.controller;

import java.util.List;

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
import com.example.polls.model.ClassSession;
import com.example.polls.service.ClassDateService;

@RestController
@RequestMapping("/api/attendance/classDates")
public class ClassDateController {
    
    @Autowired
	private ClassDateService classDateService;

    @GetMapping("/search/month/{month}/year/{year}")
    public ResponseEntity<Page<ClassDate>> findAllByMonthYear(Pageable pageable, @PathVariable String month, @PathVariable String year) {
		return new ResponseEntity<>(classDateService.findAllByMonthYear(pageable, month, year), HttpStatus.OK);
	}
    
    @GetMapping("/search/month/{month}/year/{year}/session/{sessionId}")
    public List<ClassDate> findAllByMonthYearAndSession(@PathVariable String month, @PathVariable String year, @PathVariable(value = "sessionId") long sessionId) {
    	System.out.println("classdatecontroller month "+month+" year "+year);
		return classDateService.findAllByMonthYearAndSession(month, year, sessionId);
	}
    
    @GetMapping("/sessions/{sessionId}")
    public List<ClassDate> findAllBySessionId(@PathVariable Long sessionId) {
    	 return classDateService.findAllBySessionId(sessionId);
	}
    
    @GetMapping
	public ResponseEntity<Page<ClassDate>> findAll(Pageable pageable) {
		return new ResponseEntity<>(classDateService.findAll(pageable), HttpStatus.OK);
	}

	@GetMapping("{id}")
	public ResponseEntity<ClassDate> findById(@PathVariable Long id) {
		return new ResponseEntity<>(classDateService.findById(id), HttpStatus.OK);
	}

	@PostMapping("/saveClassDate")
	public ResponseEntity<ClassDate> save(@RequestBody ClassDate classDate) {
		return new ResponseEntity<>(classDateService.saveOrUpdate(classDate), HttpStatus.CREATED);
	}

	@PutMapping()
	public ResponseEntity<ClassDate> update(ClassDate classDate) {
		return new ResponseEntity<>(classDateService.saveOrUpdate(classDate), HttpStatus.OK);
	}

	@DeleteMapping("{id}")
	public ResponseEntity<String> deleteById(@PathVariable Long id) {
		return new ResponseEntity<>(classDateService.deleteById(id), HttpStatus.OK);
	}
}
