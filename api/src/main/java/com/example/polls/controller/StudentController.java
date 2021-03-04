package com.example.polls.controller;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

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
import com.example.polls.service.StudentService;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    
    @Autowired
	private StudentService studentService;
    
    @GetMapping("/search/{searchText}/active/{active}")
	public ResponseEntity<Page<Student>> findAll(Pageable pageable, @PathVariable String searchText, @PathVariable boolean active) {
		System.out.println("findAll controller search"+searchText+" boolean active "+active);
		return new ResponseEntity<>(studentService.findAll(pageable, searchText, active), HttpStatus.OK);
	}

    @GetMapping
	public ResponseEntity<Page<Student>> findAll(Pageable pageable) {
		System.out.println("findAll controller"+pageable.getPageNumber()+" "+pageable.getPageSize());
		return new ResponseEntity<>(studentService.findAll(pageable), HttpStatus.OK);
	}

	@GetMapping("/active/{active}")
	public ResponseEntity<Page<Student>> findAllByActive(Pageable pageable, @PathVariable boolean active) {
		return new ResponseEntity<>(studentService.findAllByActive(pageable, active), HttpStatus.OK);
	}
	
	@GetMapping("{id}")
	public ResponseEntity<Student> findById(@PathVariable Long id) {
		System.out.println("student id"+id);
		return new ResponseEntity<>(studentService.findById(id), HttpStatus.OK);
	}

	@PostMapping("/saveStudent")
	public ResponseEntity<Student> save(@RequestBody Student student) {
		return new ResponseEntity<>(studentService.saveOrUpdate(student), HttpStatus.CREATED);
	}

	@DeleteMapping("{id}")
	public ResponseEntity<String> deleteById(@PathVariable Long id) {
		return new ResponseEntity<>(studentService.deleteById(id), HttpStatus.OK);
	}
	
	@GetMapping("/languages")
	public  ResponseEntity<Set<String>> findAllLanguages() {
        return new ResponseEntity<>(new TreeSet<>(Arrays.asList("French", "Portuguese", "English", "Russian", "Hindi", "Arabic", "Spanish", "Chinese")), HttpStatus.OK);
    }

    @GetMapping("/genres")
    public  ResponseEntity<Set<String>> findAllGenres() {
        return new ResponseEntity<>(new TreeSet<>(Arrays.asList("Technology", "Science", "History", "Fantasy", "Biography", "Horror", "Romance")), HttpStatus.OK);
    }

}
