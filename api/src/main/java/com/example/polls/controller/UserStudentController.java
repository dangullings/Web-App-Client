package com.example.polls.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.polls.model.User_Student;
import com.example.polls.service.UserStudentService;

@RestController
@RequestMapping("/api/user_students")
public class UserStudentController {

	@Autowired
	private UserStudentService userStudentService;
	
	@PostMapping("/saveUserStudent")
	public ResponseEntity<User_Student> save(@RequestBody User_Student userStudent) {
		System.out.println("userstudent save"+userStudent.toString());
		return new ResponseEntity<>(userStudentService.saveOrUpdate(userStudent), HttpStatus.CREATED);
	}
	
}