package com.example.polls.model;

import java.io.Serializable;

public class Calendar_Event_Student_Id implements Serializable {

	private long calendarEventId;
	
    private long studentId;
 
    public Calendar_Event_Student_Id() {
		
	}

	public long getCalendarEventId() {
		return calendarEventId;
	}

	public void setCalendarEventId(long calendarEventId) {
		this.calendarEventId = calendarEventId;
	}

	public long getStudentId() {
		return studentId;
	}

	public void setStudentId(long studentId) {
		this.studentId = studentId;
	}
	
}
