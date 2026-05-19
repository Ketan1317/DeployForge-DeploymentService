import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { deploymentAPI } from '../services/api';
import './DeploymentForm.css';

interface DeploymentFormProps {
  onSuccess?: () => void;
}

export const DeploymentForm: React.FC<DeploymentFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    gitUrl: '',
    title: '',
    connectionString: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!formData.gitUrl.trim()) {
        throw new Error('Git URL is required');
      }
      if (!formData.title.trim()) {
        throw new Error('Project title is required');
      }

      await deploymentAPI.createDeployment(
        formData.gitUrl,
        formData.title,
        formData.connectionString,
        user!.id
      );

      setSuccess(true);
      setFormData({ gitUrl: '', title: '', connectionString: '' });
      
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deployment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deployment-form-container">
      <h2>Create New Deployment</h2>
      <p className="form-description">Deploy your project in seconds</p>

      <form onSubmit={handleSubmit} className="deployment-form">
        <div className="form-group">
          <label htmlFor="gitUrl">Git Repository URL</label>
          <input
            type="url"
            id="gitUrl"
            name="gitUrl"
            value={formData.gitUrl}
            onChange={handleChange}
            placeholder="https://github.com/username/repo.git"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Project Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="My Awesome Project"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="connectionString">Connection String (Optional)</label>
          <textarea
            id="connectionString"
            name="connectionString"
            value={formData.connectionString}
            onChange={handleChange}
            placeholder="Azure Storage connection string or database URL"
            rows={3}
            disabled={loading}
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            ✓ Deployment created successfully!
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Deploying...
            </>
          ) : (
            '🚀 Deploy Now'
          )}
        </button>
      </form>
    </div>
  );
};
