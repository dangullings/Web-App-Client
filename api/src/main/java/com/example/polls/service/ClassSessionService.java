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

import com.example.polls.model.ClassSession;
import com.example.polls.model.Student;
import com.example.polls.repository.ClassSessionRepo;
import com.example.polls.repository.StudentRepository;
import com.example.polls.repository.Student_Session_Repository;

@Service
public class ClassSessionService {

	@Autowired
    private ClassSessionRepo classSessionRepo;
	@Autowired
    private Student_Session_Repository studentSessionRepository;
	@Autowired
    private StudentRepository studentRepository;

    private static final Logger logger = LoggerFactory.getLogger(TestService.class);
	
	public Page<ClassSession> findAll(Pageable pageable) {
		System.out.println("findAll teststudent service"+pageable.getPageNumber()+" "+pageable.getPageSize());
		return classSessionRepo.findAll(pageable);
	}

	public ClassSession findById(Long id) {
		return classSessionRepo.findById(id).get();
	}

	public ClassSession saveOrUpdate(ClassSession classSession) {
		return classSessionRepo.save(classSession);
	}

	public String deleteById(Long id) {
		JSONObject jsonObject = new JSONObject();
		try {
			classSessionRepo.deleteById(id);
			jsonObject.put("message", "Book deleted successfully");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return jsonObject.toString();
	}

	public List<ClassSession> findAllByDate() {
		return classSessionRepo.findAllByDate();
	}
	
	public List<Student> findAllStudentsById(long sessionId) {
		List<Long> studentIds = studentSessionRepository.findAllBySessionId(sessionId);
		List<Student> students = (List<Student>) studentRepository.findAllById(studentIds);
		
		System.out.println("findallstudentbyid service "+students.toString());
		
		return students;
	}
	
}
