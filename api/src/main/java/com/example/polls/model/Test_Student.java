package com.example.polls.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.PostLoad;
import javax.persistence.Table;

@Entity
@Table(name = "test_student")
@IdClass(Test_Student_Id.class)
public class Test_Student {

    //@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
    private long testId;
	
	@Id
    private long studentId;

    private String form, steps, power, kiap, questions, attitude, sparring, breaking;

    public Test_Student() {

    }

    public Test_Student(long testId, long studentId) {
        this.testId = testId;
        this.studentId = studentId;
    }

    public boolean inRange(String score){
        return ((score.equalsIgnoreCase("5")) || (score.equalsIgnoreCase("6")) || (score.equalsIgnoreCase("7")) || (score.equalsIgnoreCase("8")) || (score.equalsIgnoreCase("9")));
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

	public String getForm() {
        return form;
    }

    public void setForm(String form) {
        this.form = form;
    }

    public String getSteps() {
        return steps;
    }

    public void setSteps(String steps) {
        this.steps = steps;
    }

    public String getPower() {
        return power;
    }

    public void setPower(String power) {
        this.power = power;
    }

    public String getKiap() {
        return kiap;
    }

    public void setKiap(String kiap) {
        this.kiap = kiap;
    }

    public String getQuestions() {
        return questions;
    }

    public void setQuestions(String questions) {
        this.questions = questions;
    }

    public String getAttitude() {
        return attitude;
    }

    public void setAttitude(String attitude) {
        this.attitude = attitude;
    }

    public String getSparring() {
        return sparring;
    }

    public void setSparring(String sparring) {
        this.sparring = sparring;
    }

    public String getBreaking() {
        return breaking;
    }

    public void setBreaking(String breaking) {
        this.breaking = breaking;
    }
    
    @PostLoad
    private void postLoadFunction(){
        System.out.println("id"+this.studentId+" testid"+this.testId+" form"+this.getForm());
    }
}
