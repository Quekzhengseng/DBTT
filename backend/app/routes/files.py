from flask import Blueprint, request, jsonify, current_app
import os
from werkzeug.utils import secure_filename

files_bp = Blueprint('files', __name__)

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'doc', 'docx', 'md'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@files_bp.route('/upload', methods=['POST'])
def upload_file():
    """Process an uploaded file and add it to the knowledge base."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        
        # Save the file temporarily
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Extract text from file
            text_chunks = current_app.services.text_processor.process_file(filepath)
            
            # Generate embeddings and store in ChromaDB
            for i, chunk in enumerate(text_chunks):
                # Generate embeddings
                embedding = current_app.services.embedding_service.generate(chunk)
                
                # Store in ChromaDB
                metadata = {
                    'source': filename,
                    'chunk_id': i,
                    'content_preview': chunk[:100]  # First 100 chars as preview
                }
                current_app.services.chroma_service.add(
                    texts=[chunk],
                    embeddings=[embedding],
                    metadatas=[metadata],
                    ids=[f"{filename}-chunk-{i}"]
                )
                
            # Optional: Delete temporary file after processing
            os.remove(filepath)
            
            return jsonify({
                'success': True,
                'message': f'File {filename} processed and added to knowledge base',
                'chunks_processed': len(text_chunks)
            })
            
        except Exception as e:
            # Handle processing errors
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'File type not allowed'}), 400

@files_bp.route('/sources', methods=['GET'])
def get_sources():
    """Get a list of all source documents in the knowledge base."""
    sources = current_app.services.chroma_service.get_sources()
    return jsonify(sources)

@files_bp.route('/delete/<source_id>', methods=['DELETE'])
def delete_source(source_id):
    """Remove a source document from the knowledge base."""
    success = current_app.services.chroma_service.delete_source(source_id)
    if success:
        return jsonify({'success': True})
    return jsonify({'error': 'Source not found'}), 404