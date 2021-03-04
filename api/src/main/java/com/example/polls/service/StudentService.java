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

import com.example.polls.model.Student;
import com.example.polls.repository.StudentRepository;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    private static final Logger logger = LoggerFactory.getLogger(StudentService.class);

    public Page<Student> findAll(Pageable pageable, String searchText, boolean active) {
    	System.out.println("pageable "+pageable.getPageNumber());
		return studentRepository.findAll(pageable, searchText, active);
	}
    
	public Page<Student> findAll(Pageable pageable) {
		return studentRepository.findAll(pageable);
	}

	public Student findById(Long id) {
		return studentRepository.findById(id).get();
	}

	public Student saveOrUpdate(Student student) {
		return studentRepository.save(student);
	}

	public String deleteById(Long id) {
		JSONObject jsonObject = new JSONObject();
		try {
			studentRepository.deleteById(id);
			jsonObject.put("message", "Book deleted successfully");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return jsonObject.toString();
	}
	
	public Page<Student> findAllByActive(Pageable pageable, boolean active) {
		return studentRepository.findAllByActive(pageable, active);
	}

}