package com.example.polls.service;

import java.util.Collection;
import java.util.List;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.polls.model.ClassDate;
import com.example.polls.model.Test;
import com.example.polls.model.Test_Student;
import com.example.polls.repository.TestRepository;

@Service
public class TestService {

    @Autowired
    private TestRepository testRepository;

    private static final Logger logger = LoggerFactory.getLogger(TestService.class);
	
    public Page<Test> findAllByMonthYear(Pageable pageable, String month, String year) {
    	System.out.println("findAll test service"+month);
		return testRepository.findAllByMonthYear(pageable, month, year);
	}
    
	public Page<Test> findAll(Pageable pageable) {
		return testRepository.findAll(pageable);
	}

	public Page<Test> findAllOrderByDate(Pageable pageable) {
		return testRepository.findAllOrderByDate(pageable);
	}
	
	public Test findById(Long id) {
		return testRepository.findById(id).get();
	}

	public Test saveOrUpdate(Test test) {
		System.out.println("save test "+test);
		return testRepository.save(test);
	}

	public String deleteById(Long id) {
		JSONObject jsonObject = new JSONObject();
		try {
		    testRepository.deleteById(id);
			jsonObject.put("message", "Book deleted successfully");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return jsonObject.toString();
	}
}
