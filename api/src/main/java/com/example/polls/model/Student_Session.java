package com.example.polls.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

@Entity
@Table(name = "class_session_students")
@IdClass(Student_Session_Id.class)
public class Student_Session {
	@Id
    private long classSessionId;
	
	@Id
    private long studentId;

	public Student_Session() {
		super();
	}

	public long getClassSessionId() {
		return classSessionId;
	}

	public void setClassSessionId(long classSessionId) {
		this.classSessionId = classSessionId;
	}

	public long getStudentId() {
		return studentId;
	}

	public void setStudentId(long studentId) {
		this.studentId = studentId;
	}


}