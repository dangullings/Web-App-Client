package com.example.polls.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.polls.model.CalendarEvent;
import com.example.polls.model.CalendarEvent_Student;
import com.example.polls.repository.EventRepo;
import com.example.polls.service.Student_Event_Service;

@RestController
@RequestMapping("/api/students")
public class Student_Event_Controller {

	@Autowired
	private Student_Event_Service student_event_service;
	@Autowired
	private EventRepo event_repo;
	
	@GetMapping("/{studentId}/events")
    public List<CalendarEvent> findAllByStudentId(@PathVariable(value = "studentId") long studentId) {
        List<CalendarEvent_Student> student_event_list =  student_event_service.findAllByStudentId(studentId);
        List<Long> eventList = new ArrayList<Long>();
        for (CalendarEvent_Student ss : student_event_list) {
        	eventList.add(ss.getCalendarEventId());
        }
        
        if (eventList != null) {
        	return event_repo.findAllById(eventList);
        }
        
		return null;
    }
	
	@PostMapping("/saveStudentEvent")
	public ResponseEntity<CalendarEvent_Student> save(@RequestBody CalendarEvent_Student studentEvent) {
		return new ResponseEntity<>(student_event_service.saveOrUpdate(studentEvent), HttpStatus.CREATED);
	}
	
}