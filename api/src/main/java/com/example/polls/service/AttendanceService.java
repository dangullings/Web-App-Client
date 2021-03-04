package com.example.polls.service;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.polls.model.Attendance;
import com.example.polls.repository.AttendanceRepo;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepo attendanceRepo;

    private static final Logger logger = LoggerFactory.getLogger(TestService.class);
	
	public Page<Attendance> findAll(Pageable pageable) {
		System.out.println("findAll teststudent service"+pageable.getPageNumber()+" "+pageable.getPageSize());
		return attendanceRepo.findAll(pageable);
	}

	public Attendance findById(Long id) {
		return attendanceRepo.findById(id).get();
	}

	public Attendance saveOrUpdate(Attendance attendance) {
		return attendanceRepo.save(attendance);
	}

	public String deleteById(Long id) {
		JSONObject jsonObject = new JSONObject();
		try {
			attendanceRepo.deleteById(id);
			jsonObject.put("message", "Book deleted successfully");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return jsonObject.toString();
	}

	public Attendance findByClassDateIdAndStudentId(Long classDateId, Long studentId) {
		System.out.println("findbytestidandstudentid service"+classDateId+" "+studentId);
		return attendanceRepo.findByClassDateIdAndStudentId(classDateId, studentId);
	}
	
}