package com.example.polls.model;

import java.io.Serializable;

import javax.persistence.Id;

public class Test_Student_Id implements Serializable {

	private long testId;
	
    private long studentId;
 
    public Test_Student_Id() {
		
	}

	public long getTestId() {
		return testId;
	}

	public void setTestId(long testId) {
		this.testId = testId;
	}

	public long getStudentId() {
		return studentId;
	}

	public void setStudentId(long studentId) {
		this.studentId = studentId;
	}
 
}