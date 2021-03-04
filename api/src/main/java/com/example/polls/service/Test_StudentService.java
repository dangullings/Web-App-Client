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
import com.example.polls.model.Test;
import com.example.polls.model.Test_Student;
import com.example.polls.repository.StudentRepository;
import com.example.polls.repository.TestRepository;
import com.example.polls.repository.Test_StudentRepository;

@Service
public class Test_StudentService {

    @Autowired
    private Test_StudentRepository student_testRepository;
    @Autowired
    private TestRepository testRepository;
    @Autowired
    private StudentRepository studentRepository;

    private static final Logger logger = LoggerFactory.getLogger(TestService.class);
	
	public Page<Test_Student> findAll(Pageable pageable) {
		return student_testRepository.findAll(pageable);
	}

	public Test_Student findById(Long id) {
		return student_testRepository.findById(id).get();
	}

	public Test_Student saveOrUpdate(Test_Student test) {
		return student_testRepository.save(test);
	}

	public void deleteAllByTestId(Long testId) {
		student_testRepository.deleteAllByTestId(testId);
	}
	
	public void deleteAllByTestIdAndStudentId(Long testId, Long studentId) {
		student_testRepository.deleteAllByTestIdAndStudentId(testId, studentId);
	}
	
	public String deleteById(Long id) {
		JSONObject jsonObject = new JSONObject();
		try {
			student_testRepository.deleteById(id);
			jsonObject.put("message", "Book deleted successfully");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return jsonObject.toString();
	}

	public Page<Test_Student> findAllByStudentId(Pageable pageable, Long studentId) {
		System.out.println("findbystudentid teststudent service"+pageable.getPageNumber()+" "+pageable.getPageSize()+" student"+studentId);
		return student_testRepository.findAllByStudentId(pageable, studentId);
	}
	
	public Test_Student findByTestIdAndStudentId(Long testId, Long studentId) {
		System.out.println("findbytestidandstudentid service"+testId+" "+studentId);
		return student_testRepository.findByTestIdAndStudentId(testId, studentId);
	}

	public List<Student> findAllStudentsById(long testId) {
		List<Long> studentIds = student_testRepository.findAllByTestId(testId);
		List<Student> students = (List<Student>) studentRepository.findAllById(studentIds);
		
		return students;
	}

	public List<Test> findAllTestsByStudentId(long studentId) {
		List<Long> testIds = student_testRepository.findAllByStudentId(studentId);
		List<Test> tests = (List<Test>) testRepository.findAllById(testIds);
		
		return tests;
	}
	
}