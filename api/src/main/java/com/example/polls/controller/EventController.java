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

import com.example.polls.model.CalendarEvent;
import com.example.polls.model.ClassSession;
import com.example.polls.model.Student;
import com.example.polls.service.EventService;

@RestController
@RequestMapping("/api/schedule/events")
public class EventController {

	@Autowired
	private EventService eventService;

	@GetMapping("/search/month/{month}/year/{year}")
    public ResponseEntity<Page<CalendarEvent>> findAllByMonthYear(Pageable pageable, @PathVariable String month, @PathVariable String year) {
		System.out.println("eventcontroller month "+month+" year "+year);
		return new ResponseEntity<>(eventService.findAllByMonthYear(pageable, month, year), HttpStatus.OK);
	}
	
	@GetMapping
	public ResponseEntity<Page<CalendarEvent>> findAll(Pageable pageable) {
		return new ResponseEntity<>(eventService.findAll(pageable), HttpStatus.OK);
	}

	@GetMapping("{id}")
	public ResponseEntity<CalendarEvent> findById(@PathVariable Long id) {
		return new ResponseEntity<>(eventService.findById(id), HttpStatus.OK);
	}

	@GetMapping("/date")
    public List<CalendarEvent> findAllByDate() {
        return eventService.findAllByDate();
    }
	
	@PostMapping("/saveEvent")
	public ResponseEntity<CalendarEvent> save(@RequestBody CalendarEvent event) {
		return new ResponseEntity<>(eventService.saveOrUpdate(event), HttpStatus.CREATED);
	}

	@PutMapping()
	public ResponseEntity<CalendarEvent> update(CalendarEvent event) {
		return new ResponseEntity<>(eventService.saveOrUpdate(event), HttpStatus.OK);
	}

	@DeleteMapping("{id}")
	public ResponseEntity<String> deleteById(@PathVariable Long id) {
		return new ResponseEntity<>(eventService.deleteById(id), HttpStatus.OK);
	}
}

