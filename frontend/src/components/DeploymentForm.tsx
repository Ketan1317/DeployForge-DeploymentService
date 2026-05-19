import React, { useState, useEffect } from 'react';
import { authAPI, deploymentAPI } from '../services/api';

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
    <div className="w-full bg-[#0a0a0f] border border-white/10 p-6 md:p-8 text-white font-sans shadow-2xl">
      <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider mb-2">
        Create New Deployment
      </h2>
      <p className="text-xs text-white/50 font-bold uppercase tracking-widest mb-6">
        Select a repository to deploy
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Repository List
          </label>
          
          {loadingRepos ? (
            <div className="flex items-center gap-3 py-12 justify-center text-white/50 text-xs font-bold uppercase tracking-wider">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/15 border-t-white"></div>
              Fetching your repositories...
            </div>
          ) : repoError ? (
            <div className="p-4 border border-red-500/20 bg-red-500/10 text-red-300 text-xs flex items-center justify-between">
              <span>{repoError}</span>
              <button
                type="button"
                onClick={fetchRepos}
                className="text-[10px] font-black uppercase tracking-widest hover:underline text-white cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {repos.map((repo) => (
                <label
                  key={repo.id}
                  className={`group relative flex items-center justify-between p-4 border transition-all duration-300 cursor-pointer ${
                    selectedRepo === repo.cloneUrl
                      ? 'border-white bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                      : 'border-white/5 bg-white/[0.01] hover:border-white/15 hover:bg-white/[0.03]'
                  }`}
                >
                  <input
                    type="radio"
                    name="repo"
                    value={repo.cloneUrl}
                    checked={selectedRepo === repo.cloneUrl}
                    onChange={(e) => setSelectedRepo(e.target.value)}
                    disabled={deploying}
                    className="sr-only"
                  />
                  
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-bold text-sm tracking-wide text-white group-hover:text-white transition-colors duration-250 truncate">
                        {repo.name}
                      </span>
                      {repo.private && (
                        <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-white/10 text-white/70 border border-white/10">
                          Private
                        </span>
                      )}
                    </div>
                    
                    <span className="text-[10px] text-white/40 block font-mono truncate mt-0.5">
                      {repo.fullName}
                    </span>
                    
                    {repo.description && (
                      <p className="mt-1 text-xs text-white/50 line-clamp-1 font-medium leading-relaxed">
                        {repo.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    {repo.language && (
                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-white/10 text-white/70">
                        {repo.language}
                      </span>
                    )}
                    <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ${
                      selectedRepo === repo.cloneUrl
                        ? 'border-white bg-white shadow-[0_0_8px_rgba(255,255,255,0.2)]'
                        : 'border-white/25 bg-transparent'
                    }`}>
                      {selectedRepo === repo.cloneUrl && (
                        <div className="h-1.5 w-1.5 rounded-full bg-black"></div>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 border border-red-500/30 bg-red-500/10 text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-4 border border-green-500/30 bg-green-500/10 text-green-300 text-xs font-black uppercase tracking-wider">
            ✓ Deploying {getSelectedRepoName()}!
          </div>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-white/90 text-black disabled:bg-white/5 disabled:text-white/20 px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-all duration-300 transform active:scale-98 cursor-pointer disabled:pointer-events-none"
          disabled={deploying || !selectedRepo || loadingRepos}
        >
          {deploying ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black"></div>
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
