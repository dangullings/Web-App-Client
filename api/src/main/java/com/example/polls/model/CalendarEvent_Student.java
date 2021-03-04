package com.example.polls.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

@Entity
@Table(name = "calendar_events_students")
@IdClass(Calendar_Event_Student_Id.class)
public class CalendarEvent_Student {

	@Id
    private long calendarEventId;
	
	@Id
    private long studentId;
	
	private boolean isAttending;

	public CalendarEvent_Student() {
		super();
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

	public boolean isAttending() {
		return isAttending;
	}

	public void setAttending(boolean isAttending) {
		this.isAttending = isAttending;
	}
	
	
}
