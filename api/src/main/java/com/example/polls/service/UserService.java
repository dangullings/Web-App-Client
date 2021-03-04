package com.example.polls.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.polls.model.Student;
import com.example.polls.repository.StudentRepository;
import com.example.polls.repository.User_Student_Repo;

@Service
public class UserService {

    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private User_Student_Repo user_student_repo;
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

	public List<Student> findAllStudentsByUserId(long userId) {
		List<Long> studentIds = user_student_repo.findAllStudentIdsByUserId(userId);
		List<Student> students = (List<Student>) studentRepository.findAllById(studentIds);
		
		System.out.println("user service user id "+userId);
		
		return students;
	}
}