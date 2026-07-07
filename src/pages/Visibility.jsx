import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useToast } from '../context/ToastContext';

export const Visibility = () => {
  const { fetchStats } = useOutletContext();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);

  useEffect(() => {
    loadVisibility();
  }, []);

  const loadVisibility = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, image_url, visible')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      showToast('Failed to load visibility grid: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (id, currentVal) => {
    setToggling(id);
    const newVal = !currentVal;
    try {
      const { error } = await supabase
        .from('products')
        .update({ visible: newVal, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => 
        prev.map(p => p.id === id ? { ...p, visible: newVal } : p)
      );
      
      showToast(`Project visibility ${newVal ? 'enabled' : 'disabled'}.`, 'success');
      fetchStats();
    } catch (err) {
      showToast('Failed to update visibility: ' + err.message, 'error');
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="tab-panel active">
      <div className="admin-card">
        <div className="section-header">
          <div className="admin-card-title" style={{ marginBottom: 0 }}>
            <span className="title-icon">👁️</span>
            Project Visibility
          </div>
          <button className="btn-secondary" onClick={loadVisibility} style={{ fontSize: '.8rem', padding: '.5rem 1rem' }}>
            🔄 Refresh
          </button>
        </div>

        <p style={{ fontSize: '.82rem', color: 'var(--grey-text)', marginBottom: '1.25rem', lineHeight: '1.6' }}>
          Toggle to control which projects appear on the public website. Changes take effect immediately.
        </p>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : products.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {products.map(p => (
              <div key={p.id} className="vis-card" style={{ display: 'flex', flexDirection: 'column', background: 'var(--white)', border: '1px solid var(--grey-mid)', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--grey-bg)' }}>
                  <img src={p.image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                </div>
                <div style={{ padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.5rem' }}>
                  <div className="vis-card-title" style={{ fontSize: '.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                    {p.title}
                  </div>
                  
                  {/* Custom Toggle Switch */}
                  <label className="toggle-switch" style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px', flexShrink: 0 }}>
                    <input 
                      type="checkbox" 
                      checked={p.visible} 
                      onChange={() => toggleVisibility(p.id, p.visible)}
                      disabled={toggling === p.id}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span 
                      className="slider" 
                      style={{
                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: p.visible ? '#4caf50' : '#ccc',
                        transition: '.4s', borderRadius: '34px',
                        opacity: toggling === p.id ? 0.5 : 1
                      }}
                    >
                      <span 
                        style={{
                          position: 'absolute', content: '""', height: '14px', width: '14px', left: '3px', bottom: '3px',
                          backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                          transform: p.visible ? 'translateX(20px)' : 'translateX(0)'
                        }}
                      />
                    </span>
                  </label>
                  
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">No projects found. Add one in the Products tab.</div>
        )}
      </div>
    </div>
  );
};
