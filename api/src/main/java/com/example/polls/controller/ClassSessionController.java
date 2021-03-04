package com.example.polls.controller;

import java.util.ArrayList;
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

import com.example.polls.model.ClassSession;
import com.example.polls.model.Student;
import com.example.polls.model.Student_Session;
import com.example.polls.service.ClassSessionService;

@RestController
@RequestMapping("/api/attendance/sessions")
public class ClassSessionController {
    
    @Autowired
	private ClassSessionService classSessionService;

    @GetMapping
	public ResponseEntity<Page<ClassSession>> findAll(Pageable pageable) {
		System.out.println("findAll teststudent controllers"+pageable.getPageNumber()+" "+pageable.getPageSize());
		return new ResponseEntity<>(classSessionService.findAll(pageable), HttpStatus.OK);
	}

	@GetMapping("{id}")
	public ResponseEntity<ClassSession> findById(@PathVariable Long id) {
		System.out.println("findbyid "+id);
		return new ResponseEntity<>(classSessionService.findById(id), HttpStatus.OK);
	}

	@PostMapping("/saveSession")
	public ResponseEntity<ClassSession> save(@RequestBody ClassSession classSession) {
		return new ResponseEntity<>(classSessionService.saveOrUpdate(classSession), HttpStatus.CREATED);
	}

	@PutMapping()
	public ResponseEntity<ClassSession> update(ClassSession classSession) {
		return new ResponseEntity<>(classSessionService.saveOrUpdate(classSession), HttpStatus.OK);
	}

	@DeleteMapping("{id}")
	public ResponseEntity<String> deleteById(@PathVariable Long id) {
		return new ResponseEntity<>(classSessionService.deleteById(id), HttpStatus.OK);
	}
	
	@GetMapping("/date")
    public List<ClassSession> findAllByDate() {
        return classSessionService.findAllByDate();
    }
	
	@GetMapping("/{sessionId}/students")
    public List<Student> findAllStudentsById(@PathVariable(value = "sessionId") long sessionId) {
		System.out.println("findallstudentbyid controller "+sessionId);
		
        return classSessionService.findAllStudentsById(sessionId);
    }
}
