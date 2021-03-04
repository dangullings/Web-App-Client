package com.example.polls.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.polls.model.Student;
import com.example.polls.model.Student_Session;
import com.example.polls.repository.Student_Session_Repository;

@Service
public class Student_Session_Service {

	@Autowired
    private Student_Session_Repository student_session_repository;
	
	public List<Student_Session> findAllByStudentId(long studentId) {
		return student_session_repository.findAllByStudentId(studentId);
	}
	
	public Student_Session saveOrUpdate(Student_Session studentSession) {
		return student_session_repository.save(studentSession);
	}
}
