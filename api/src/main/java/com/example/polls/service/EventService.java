package com.example.polls.service;

import java.util.List;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.polls.model.ClassDate;
import com.example.polls.model.ClassSession;
import com.example.polls.model.CalendarEvent;
import com.example.polls.repository.EventRepo;

@Service
public class EventService {

	@Autowired
    private EventRepo eventRepo;
	
	public Page<CalendarEvent> findAllByMonthYear(Pageable pageable, String month, String year) {
		return eventRepo.findAllByMonthYear(pageable, month, year);
	}
	
	public Page<CalendarEvent> findAll(Pageable pageable) {
		return eventRepo.findAll(pageable);
	}

	public CalendarEvent findById(Long id) {
		return eventRepo.findById(id).get();
	}

	public CalendarEvent saveOrUpdate(CalendarEvent event) {
		return eventRepo.save(event);
	}

	public List<CalendarEvent> findAllByDate() {
		return eventRepo.findAllByDate();
	}
	
	public String deleteById(Long id) {
		JSONObject jsonObject = new JSONObject();
		try {
			eventRepo.deleteById(id);
			jsonObject.put("message", "Event deleted successfully");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return jsonObject.toString();
	}
}
