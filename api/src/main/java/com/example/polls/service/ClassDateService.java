package com.example.polls.service;

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
import com.example.polls.repository.ClassDateRepo;

@Service
public class ClassDateService {

    @Autowired
    private ClassDateRepo classDateRepo;

    private static final Logger logger = LoggerFactory.getLogger(TestService.class);
	
    public Page<ClassDate> findAllByMonthYear(Pageable pageable, String month, String year) {
		return classDateRepo.findAllByMonthYear(pageable, month, year);
	}
    
    public List<ClassDate> findAllByMonthYearAndSession(String month, String year, long session) {
    	System.out.println("findAllbysession classdate service"+session);
		return classDateRepo.findAllByMonthYearAndSession(month, year, session);
	}
    
	public Page<ClassDate> findAll(Pageable pageable) {
		System.out.println("findAll teststudent service"+pageable.getPageNumber()+" "+pageable.getPageSize());
		return classDateRepo.findAll(pageable);
	}

	public List<ClassDate> findAllBySessionId(Long sessionId) {
		return classDateRepo.findAllBySessionId(sessionId);
	}
	
	public ClassDate findById(Long id) {
		return classDateRepo.findById(id).get();
	}

	public ClassDate saveOrUpdate(ClassDate classDate) {
		return classDateRepo.save(classDate);
	}

	public String deleteById(Long id) {
		JSONObject jsonObject = new JSONObject();
		try {
			classDateRepo.deleteById(id);
			jsonObject.put("message", "Book deleted successfully");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return jsonObject.toString();
	}
	
}