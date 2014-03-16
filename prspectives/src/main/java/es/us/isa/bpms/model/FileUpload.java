package es.us.isa.bpms.model;

import org.springframework.web.multipart.MultipartFile;

public class FileUpload {
	private MultipartFile file;

	public FileUpload(MultipartFile file) {
		super();
		this.file = file;
	}

	public MultipartFile getFile() {
		return file;
	}

	public void setFile(MultipartFile file) {
		this.file = file;
	}

	
	
}
