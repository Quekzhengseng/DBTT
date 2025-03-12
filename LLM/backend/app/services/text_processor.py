import os
import re
from langchain.text_splitter import RecursiveCharacterTextSplitter
import PyPDF2
import docx

class TextProcessor:
    """Service for processing and chunking text documents."""
    
    def __init__(self, chunk_size=1000, chunk_overlap=200):
        """Initialize with chunking parameters."""
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len
        )
    
    def process_file(self, file_path):
        """Process a file and return chunks of text."""
        # Extract text based on file type
        text = self.extract_text(file_path)
        
        # Split text into chunks
        chunks = self.text_splitter.split_text(text)
        
        return chunks
    
    def extract_text(self, file_path):
        """Extract text from various file formats."""
        file_extension = os.path.splitext(file_path)[1].lower()
        
        if file_extension == '.pdf':
            return self._extract_from_pdf(file_path)
        elif file_extension in ['.docx']:
            return self._extract_from_docx(file_path)
        elif file_extension in ['.txt', '.md']:
            return self._extract_from_text(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_extension}")
    
    def _extract_from_pdf(self, file_path):
        """Extract text from PDF files."""
        text = ""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        return text
    
    def _extract_from_docx(self, file_path):
        """Extract text from DOCX files."""
        doc = docx.Document(file_path)
        text = ""
        for para in doc.paragraphs:
            text += para.text + "\n"
        return text
    
    def _extract_from_text(self, file_path):
        """Extract text from plain text files."""
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()