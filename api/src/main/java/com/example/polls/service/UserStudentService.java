package com.example.polls.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.polls.model.User_Student;
import com.example.polls.repository.User_Student_Repo;

@Service
public class UserStudentService {

	@Autowired
    private User_Student_Repo userStudentRepo;
	
	public User_Student saveOrUpdate(User_Student userStudent) {
		return userStudentRepo.save(userStudent);
	}
}