import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useToast } from '../context/ToastContext';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const TARGET_RATIO = 16 / 9;
const RATIO_TOLERANCE = 0.04;

export const Products = () => {
  const { fetchStats } = useOutletContext();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [fileError, setFileError] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      showToast('Failed to load products: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateImage = (selectedFile) => {
    return new Promise((resolve, reject) => {
      if (!selectedFile) return reject('No file selected.');
      
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(selectedFile.type)) {
        return reject('Invalid file type. Only JPG, PNG, and WebP are allowed.');
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        return reject('File is too large. Maximum size is 2 MB.');
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(selectedFile);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const ratio = img.naturalWidth / img.naturalHeight;
        const diff = Math.abs(ratio - TARGET_RATIO) / TARGET_RATIO;
        if (diff > RATIO_TOLERANCE) {
          return reject(`Invalid aspect ratio (${(ratio).toFixed(2)}:1). Must be exactly 16:9.`);
        }
        resolve(selectedFile);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject('Invalid or corrupted image file.');
      };
      img.src = objectUrl;
    });
  };

  const handleFileSelect = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    
    try {
      setFileError('');
      await validateImage(selected);
      setFile(selected);
      setPreviewSrc(URL.createObjectURL(selected));
    } catch (err) {
      setFileError(err);
      setFile(null);
      setPreviewSrc(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewSrc(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !file) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      // 2. Insert into DB
      const { error: insertError } = await supabase
        .from('products')
        .insert([{
          title,
          description,
          product_url: url || '',
          image_url: publicUrl,
          visible: true
        }]);

      if (insertError) throw insertError;

      showToast('Project added successfully!', 'success');
      
      // Reset form
      setTitle('');
      setUrl('');
      setDescription('');
      removeFile();
      
      // Refresh data
      loadProducts();
      fetchStats();

    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      // Extract filename from URL
      const parts = imageUrl.split('/');
      const fileName = parts[parts.length - 1];

      // Remove from storage
      if (fileName) {
        await supabase.storage.from('products').remove([fileName]);
      }

      // Remove from DB
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;

      showToast('Project deleted successfully.', 'success');
      
      // Refresh
      loadProducts();
      fetchStats();
    } catch (err) {
      showToast('Delete failed: ' + err.message, 'error');
    }
  };

  return (
    <div className="tab-panel active">
      {/* Add Product Form */}
      <div className="admin-card">
        <div className="admin-card-title">
          <span className="title-icon">➕</span>
          Add New Project
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            {/* Image Upload */}
            <div className="form-group full-width">
              <label>Project Image <span style={{ color: 'var(--orange)' }}>*</span></label>

              {!previewSrc ? (
                <div 
                  className="upload-zone" 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  <div className="upload-icon">📁</div>
                  <p><strong>Click to upload</strong></p>
                  <p className="upload-hint">16:9 ratio · JPG, PNG, WebP · Max 2 MB</p>
                </div>
              ) : (
                <div className="upload-preview" style={{ display: 'block' }}>
                  <img src={previewSrc} alt="Preview" style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--grey-mid)' }} />
                  <button type="button" className="remove-preview" onClick={removeFile} aria-label="Remove image">✖</button>
                </div>
              )}

              {fileError && <p className="form-hint" style={{ color: '#e53935' }}>{fileError}</p>}
            </div>

            {/* Title */}
            <div className="form-group">
              <label htmlFor="productTitle">Title <span style={{ color: 'var(--orange)' }}>*</span></label>
              <input
                type="text"
                id="productTitle"
                placeholder="e.g. Chandran Mess Website"
                maxLength="100"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <div className="char-count">{title.length} / 100</div>
            </div>

            {/* Project URL */}
            <div className="form-group">
              <label htmlFor="productUrl">Project URL (Optional)</label>
              <input
                type="url"
                id="productUrl"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label htmlFor="productDesc">Description <span style={{ color: 'var(--orange)' }}>*</span></label>
              <textarea
                id="productDesc"
                rows="3"
                placeholder="Briefly describe what this project was about..."
                maxLength="300"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
              <div className="char-count">{description.length} / 300</div>
            </div>

            <div className="form-group full-width" style={{ marginTop: '.5rem' }}>
              <button type="submit" className={`btn-primary ${submitting ? 'loading' : ''}`} disabled={submitting}>
                {submitting ? 'Uploading...' : 'Publish Project'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* List Products */}
      <div className="admin-card">
        <div className="section-header">
          <div className="admin-card-title" style={{ marginBottom: 0 }}>
            <span className="title-icon">📋</span>
            All Projects
          </div>
          <button className="btn-secondary" onClick={loadProducts} style={{ fontSize: '.8rem', padding: '.5rem 1rem' }}>
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <p style={{ color: 'var(--grey-text)' }}>Loading projects...</p>
        ) : products.length > 0 ? (
          <div className="products-list">
            {products.map(p => (
              <div key={p.id} className="product-list-item" style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid var(--grey-mid)', alignItems: 'center' }}>
                <img src={p.image_url} alt={p.title} style={{ width: '120px', height: '67.5px', objectFit: 'cover', borderRadius: '4px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--black)' }}>{p.title}</div>
                  <div style={{ fontSize: '.85rem', color: 'var(--grey-text)', marginTop: '0.2rem' }}>
                    {p.visible ? <span style={{ color: 'green' }}>Visible</span> : <span style={{ color: 'orange' }}>Hidden</span>}
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(p.id, p.image_url)}
                  style={{ background: 'none', border: '1px solid #e53935', color: '#e53935', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">No projects found. Add one above.</div>
        )}
      </div>
    </div>
  );
};
