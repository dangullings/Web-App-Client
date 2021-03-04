package com.example.polls.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.polls.model.CalendarEvent_Student;
import com.example.polls.repository.Student_Event_Repository;

@Service
public class Student_Event_Service {

	@Autowired
    private Student_Event_Repository student_event_repository;
	
	public List<CalendarEvent_Student> findAllByStudentId(long studentId) {
		return student_event_repository.findAllByStudentId(studentId);
	}
	
	public CalendarEvent_Student saveOrUpdate(CalendarEvent_Student studentEvent) {
		return student_event_repository.save(studentEvent);
	}
}