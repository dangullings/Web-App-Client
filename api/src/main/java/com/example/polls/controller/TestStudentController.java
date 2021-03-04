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

import com.example.polls.model.Student;
import com.example.polls.model.Test;
import com.example.polls.model.Test_Student;
import com.example.polls.service.Test_StudentService;

@RestController
@RequestMapping("/api/tests/student_scores")
public class TestStudentController {
    
    @Autowired
	private Test_StudentService test_studentService;

    @GetMapping
	public ResponseEntity<Page<Test_Student>> findAll(Pageable pageable) {
		return new ResponseEntity<>(test_studentService.findAll(pageable), HttpStatus.OK);
	}
	
    @GetMapping("/student/{studentId}")
	public ResponseEntity<Page<Test_Student>> findAllByStudentId(Pageable pageable, @PathVariable Long studentId) {
		return new ResponseEntity<>(test_studentService.findAllByStudentId(pageable, studentId), HttpStatus.OK);
	}
	
    @GetMapping("/{testId}/students")
    public List<Student> findAllStudentsById(@PathVariable(value = "testId") long testId) {
		System.out.println("findallstudentbytestid controller "+testId);
		
        return test_studentService.findAllStudentsById(testId);
    }
    
    @GetMapping("/{studentId}/tests")
    public List<Test> findAllTestsByStudentId(@PathVariable(value = "studentId") long studentId) {
		System.out.println("findallstudentbytestid controller "+studentId);
		
        return test_studentService.findAllTestsByStudentId(studentId);
    }
    
    @GetMapping("/{testId}/{studentId}")
	public ResponseEntity<Test_Student> findByTestIdAndStudentId(@PathVariable Long testId, @PathVariable Long studentId) {
		return new ResponseEntity<>(test_studentService.findByTestIdAndStudentId(testId, studentId), HttpStatus.OK);
	}
	
	@GetMapping("{id}")
	public ResponseEntity<Test_Student> findById(@PathVariable Long id) {
		return new ResponseEntity<>(test_studentService.findById(id), HttpStatus.OK);
	}

	@PostMapping("/saveTest_Student")
	public ResponseEntity<Test_Student> save(@RequestBody Test_Student test_student) {
		return new ResponseEntity<>(test_studentService.saveOrUpdate(test_student), HttpStatus.CREATED);
	}

	@PutMapping()
	public ResponseEntity<Test_Student> update(Test_Student test_student) {
		return new ResponseEntity<>(test_studentService.saveOrUpdate(test_student), HttpStatus.OK);
	}

	@DeleteMapping("/test/{testId}")
	public void deleteAllByTestId(@PathVariable Long testId) {
		test_studentService.deleteAllByTestId(testId);
	}
	
	@DeleteMapping("/test/{testId}/student/{studentId}")
	public void deleteAllByTestIdAndStudentId(@PathVariable Long testId, @PathVariable Long studentId) {
		test_studentService.deleteAllByTestIdAndStudentId(testId, studentId);
	}

}