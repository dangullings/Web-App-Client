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

import com.example.polls.model.Attendance;
import com.example.polls.service.AttendanceService;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    
    @Autowired
	private AttendanceService attendanceService;

    @GetMapping
	public ResponseEntity<Page<Attendance>> findAll(Pageable pageable) {
		return new ResponseEntity<>(attendanceService.findAll(pageable), HttpStatus.OK);
	}
	
    @GetMapping("/{classDateId}/{studentId}")
	public ResponseEntity<Attendance> findByClassDateIdAndStudentId(@PathVariable Long classDateId, @PathVariable Long studentId) {
		return new ResponseEntity<>(attendanceService.findByClassDateIdAndStudentId(classDateId, studentId), HttpStatus.OK);
	}

	@GetMapping("{id}")
	public ResponseEntity<Attendance> findById(@PathVariable Long id) {
		return new ResponseEntity<>(attendanceService.findById(id), HttpStatus.OK);
	}

	@PostMapping("/saveAttendance")
	public ResponseEntity<Attendance> save(@RequestBody Attendance attendance) {
		return new ResponseEntity<>(attendanceService.saveOrUpdate(attendance), HttpStatus.CREATED);
	}

	@PutMapping()
	public ResponseEntity<Attendance> update(Attendance attendance) {
		return new ResponseEntity<>(attendanceService.saveOrUpdate(attendance), HttpStatus.OK);
	}

	@DeleteMapping("{id}")
	public ResponseEntity<String> deleteById(@PathVariable Long id) {
		return new ResponseEntity<>(attendanceService.deleteById(id), HttpStatus.OK);
	}
}
