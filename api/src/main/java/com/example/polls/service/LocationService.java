package com.example.polls.service;

import java.util.Collection;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.polls.model.Location;
import com.example.polls.model.Test_Student;
import com.example.polls.repository.LocationRepository;

@Service
public class LocationService {

	@Autowired
    private LocationRepository locationRepository;
	
	public Page<Location> findAll(Pageable pageable) {
		return locationRepository.findAll(pageable);
	}

	public Location findById(Long id) {
		return locationRepository.findById(id).get();
	}

	public Location findByName(String name) {
		return locationRepository.findByName(name);
	}
	
	public Location saveOrUpdate(Location location) {
		return locationRepository.save(location);
	}

	public String deleteById(Long id) {
		JSONObject jsonObject = new JSONObject();
		try {
			locationRepository.deleteById(id);
			jsonObject.put("message", "Location deleted successfully");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return jsonObject.toString();
	}
}
