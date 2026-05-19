import React, { useState, useEffect } from 'react';
import { DeploymentForm } from './DeploymentForm';
import { deploymentAPI } from '../services/api';
import './Dashboard.css';

interface Deployment {
  id: string;
  title: string;
  status: 'success' | 'failed' | 'queued' | 'deploying';
  url?: string;
  createdAt?: string;
  gitUrl?: string;
}

export const Dashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(true);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeployments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await deploymentAPI.getDeployments();
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setDeployments(data);
    } catch (err) {
      setError('Failed to fetch deployments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeployments();
  }, []);

  const handleDeploymentSuccess = () => {
    setShowForm(false);
    setTimeout(() => {
      setShowForm(true);
      fetchDeployments();
    }, 1500);
  };

  const getStatusBadgeClass = (status: Deployment['status']) => {
    return `status-badge status-${status}`;
  };

  const getStatusLabel = (status: Deployment['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="welcome-section">
          <h1>Welcome to DeployForge</h1>
          <p>Deploy your applications instantly with GitHub integration</p>
        </div>

        <div className="dashboard-content">
          <div className="form-section">
            {showForm && (
              <DeploymentForm onSuccess={handleDeploymentSuccess} />
            )}
          </div>

          <div className="deployments-section">
            <div className="deployments-header">
              <h2>Recent Deployments</h2>
              {!loading && deployments.length > 0 && (
                <button onClick={fetchDeployments} className="refresh-btn" title="Refresh deployments">
                  🔄
                </button>
              )}
            </div>
            
            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading deployments...</p>
              </div>
            )}

            {error && !loading && (
              <div className="error-state">
                <p>{error}</p>
                <button onClick={fetchDeployments} className="retry-btn">Retry</button>
              </div>
            )}

            {!loading && deployments.length === 0 && !error && (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <p>No deployments yet</p>
                <p className="empty-hint">Create your first deployment to get started</p>
              </div>
            )}

            {!loading && deployments.length > 0 && (
              <div className="deployments-grid">
                {deployments.map((deployment) => (
                  <div key={deployment.id} className="deployment-card">
                    <div className="card-header">
                      <h3 className="deployment-title">{deployment.title}</h3>
                      <span className={getStatusBadgeClass(deployment.status)}>
                        {getStatusLabel(deployment.status)}
                      </span>
                    </div>
                    
                    {deployment.gitUrl && (
                      <p className="deployment-detail">
                        <span className="detail-label">Repository:</span>
                        <span className="detail-value">{deployment.gitUrl}</span>
                      </p>
                    )}
                    
                    {deployment.url && (
                      <p className="deployment-detail">
                        <span className="detail-label">URL:</span>
                        <a href={deployment.url} target="_blank" rel="noopener noreferrer" className="detail-link">
                          {deployment.url}
                        </a>
                      </p>
                    )}

                    {deployment.createdAt && (
                      <p className="deployment-detail">
                        <span className="detail-label">Deployed:</span>
                        <span className="detail-value">{new Date(deployment.createdAt).toLocaleDateString()}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
