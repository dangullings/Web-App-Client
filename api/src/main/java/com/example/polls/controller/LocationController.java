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

import com.example.polls.model.Location;
import com.example.polls.service.LocationService;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

	@Autowired
	private LocationService locationService;

	@GetMapping
	public ResponseEntity<Page<Location>> findAll(Pageable pageable) {
		return new ResponseEntity<>(locationService.findAll(pageable), HttpStatus.OK);
	}

	@GetMapping("{id}")
	public ResponseEntity<Location> findById(@PathVariable Long id) {
		return new ResponseEntity<>(locationService.findById(id), HttpStatus.OK);
	}

	@GetMapping("/name/{name}")
	public ResponseEntity<Location> findByName(@PathVariable String name) {
		System.out.println("name -------------"+name);
		return new ResponseEntity<>(locationService.findByName(name), HttpStatus.OK);
	}
	
	@PostMapping("/saveLocation")
	public ResponseEntity<Location> save(@RequestBody Location location) {
		return new ResponseEntity<>(locationService.saveOrUpdate(location), HttpStatus.CREATED);
	}

	@PutMapping()
	public ResponseEntity<Location> update(Location location) {
		return new ResponseEntity<>(locationService.saveOrUpdate(location), HttpStatus.OK);
	}

	@DeleteMapping("{id}")
	public ResponseEntity<String> deleteById(@PathVariable Long id) {
		return new ResponseEntity<>(locationService.deleteById(id), HttpStatus.OK);
	}
}
