import React, { useState, useEffect } from 'react';
import { authAPI, deploymentAPI } from '../services/api';
import './DeploymentForm.css';

interface Repo {
  id: number;
  name: string;
  fullName: string;
  htmlUrl: string;
  cloneUrl: string;
  description: string | null;
  private: boolean;
  language: string | null;
}

interface DeploymentFormProps {
  onSuccess?: () => void;
}

export const DeploymentForm: React.FC<DeploymentFormProps> = ({ onSuccess }) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [repoError, setRepoError] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const connectionString = import.meta.env.VITE_AZURE_CONNECTION_STRING || '';

  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    setLoadingRepos(true);
    setRepoError(null);
    try {
      const response = await authAPI.getRepos();
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setRepos(data);
      if (data.length > 0) {
        setSelectedRepo(data[0].cloneUrl);
      }
    } catch (err) {
      setRepoError(err instanceof Error ? err.message : 'Failed to fetch repositories');
    } finally {
      setLoadingRepos(false);
    }
  };

  const getSelectedRepoName = (): string => {
    const repo = repos.find((r) => r.cloneUrl === selectedRepo);
    return repo ? repo.name : '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepo) return;

    setDeploying(true);
    setError(null);
    setSuccess(false);

    try {
      await deploymentAPI.createDeployment(
        selectedRepo,
        getSelectedRepoName(),
        connectionString
      );

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deployment');
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="deployment-form-container">
      <h2>Create New Deployment</h2>
      <p className="form-description">Select a repository to deploy</p>

      <form onSubmit={handleSubmit} className="deployment-form">
        <div className="form-group">
          <label htmlFor="repo">Repository</label>
          {loadingRepos ? (
            <div className="repo-loading">
              <span className="spinner"></span>
              Fetching your repositories...
            </div>
          ) : repoError ? (
            <div className="repo-error">
              <p>{repoError}</p>
              <button type="button" onClick={fetchRepos} className="retry-link">Retry</button>
            </div>
          ) : (
            <div className="repo-list">
              {repos.map((repo) => (
                <label
                  key={repo.id}
                  className={`repo-item ${selectedRepo === repo.cloneUrl ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="repo"
                    value={repo.cloneUrl}
                    checked={selectedRepo === repo.cloneUrl}
                    onChange={(e) => setSelectedRepo(e.target.value)}
                    disabled={deploying}
                  />
                  <div className="repo-info">
                    <span className="repo-name">{repo.fullName}</span>
                    <span className="repo-meta">
                      {repo.language && <span className="repo-lang">{repo.language}</span>}
                      {repo.private && <span className="repo-private">Private</span>}
                      {repo.description && <span className="repo-desc">{repo.description}</span>}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            ✓ Deploying {getSelectedRepoName()}!
          </div>
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={deploying || !selectedRepo || loadingRepos}
        >
          {deploying ? (
            <>
              <span className="spinner"></span>
              Deploying...
            </>
          ) : (
            'Deploy Now'
          )}
        </button>
      </form>
    </div>
  );
};
