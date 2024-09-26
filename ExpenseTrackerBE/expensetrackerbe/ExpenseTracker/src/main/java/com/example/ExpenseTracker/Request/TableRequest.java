package com.example.ExpenseTracker.Request;

public class TableRequest {
	
	Boolean saveToPC;
	Boolean sendToMail;
	
	public Boolean getSaveToPC() {
		return saveToPC;
	}
	public void setSaveToPC(Boolean saveToPC) {
		this.saveToPC = saveToPC;
	}
	public Boolean getSendToMail() {
		return sendToMail;
	}
	public void setSendToMail(Boolean sendToMail) {
		this.sendToMail = sendToMail;
	}
	
}
