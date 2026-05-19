import React, { useState, useEffect } from 'react';
import { DeploymentForm } from './DeploymentForm';
import { deploymentAPI } from '../services/api';

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

  const getStatusBadge = (status: Deployment['status']) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-green-500/10 border border-green-500/30 text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
            Success
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
            Failed
          </span>
        );
      case 'deploying':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping"></span>
            Deploying
          </span>
        );
      case 'queued':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400"></span>
            Queued
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans py-12">
      <div className="mx-auto max-w-7xl px-[4vw] md:px-6 space-y-12">
        
        {/* Welcome Banner */}
        <div className="relative border-l-4 border-white pl-6 py-2">
          <h1 className="text-[clamp(1.75rem,4vw,3rem)] font-black uppercase tracking-tight leading-none mb-3 text-white">
            Welcome to DeployForge
          </h1>
          <p className="text-white/50 font-bold uppercase tracking-widest text-xs md:text-sm">
            Deploy your applications instantly with GitHub integration
          </p>
        </div>

        {/* Dashboard Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-5 self-start">
            {showForm ? (
              <DeploymentForm onSuccess={handleDeploymentSuccess} />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-[#0a0a0f] border border-green-500/20 text-center space-y-4 shadow-xl">
                <span className="text-4xl text-green-400 font-bold">✓</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-green-400">
                  Deployment Triggered!
                </h3>
                <p className="text-xs text-white/50">
                  Refreshing dashboard and updating deployment logs...
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Recent Deployments */}
          <div className="lg:col-span-7 self-start bg-[#0a0a0f] border border-white/10 p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg md:text-xl font-black uppercase tracking-wider">
                Recent Deployments
              </h2>
              
              {!loading && (
                <button
                  onClick={fetchDeployments}
                  className="bg-white/5 border border-white/10 hover:bg-white hover:text-black p-2 transition-all duration-200 cursor-pointer active:scale-90"
                  title="Refresh deployments"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.228 8H17" />
                  </svg>
                </button>
              )}
            </div>

            {/* Loading Indicator */}
            {loading && deployments.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/15 border-t-white"></div>
                <p className="text-[10px] font-black uppercase tracking-wider text-white/50">
                  Loading deployments...
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && !loading && (
              <div className="p-8 border border-red-500/20 bg-red-500/5 text-center space-y-4">
                <p className="text-xs text-red-300 font-bold uppercase tracking-wider">{error}</p>
                <button
                  onClick={fetchDeployments}
                  className="bg-white text-black font-black uppercase tracking-widest text-[10px] px-5 py-2.5 hover:bg-white/90 hover:text-black transition-all duration-250 cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && deployments.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-white/10">
                <span className="text-4xl filter grayscale">📦</span>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-white">No deployments yet</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Create your first deployment to get started</p>
                </div>
              </div>
            )}

            {/* Deployments List */}
            {!loading && deployments.length > 0 && (
              <div className="grid grid-cols-1 gap-4">
                {deployments.map((deployment) => (
                  <div
                    key={deployment.id}
                    className="group border border-white/5 hover:border-white/15 bg-white/[0.01] p-5 transition-all duration-300 shadow-lg"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold tracking-wide text-sm text-white group-hover:text-white/80 transition-colors duration-250">
                          {deployment.title}
                        </h3>
                        {deployment.createdAt && (
                          <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-1 block">
                            Deployed: {new Date(deployment.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div>{getStatusBadge(deployment.status)}</div>
                    </div>

                    <div className="space-y-3 border-t border-white/5 pt-4 mt-4">
                      {deployment.gitUrl && (
                        <div className="space-y-1">
                          <span className="text-[9px] text-white/40 uppercase tracking-widest font-black block">Repository</span>
                          <span className="block text-[11px] text-white/80 font-mono truncate select-all bg-white/[0.02] border border-white/5 px-2.5 py-1.5">
                            {deployment.gitUrl}
                          </span>
                        </div>
                      )}

                      {deployment.url && (
                        <div className="space-y-1">
                          <span className="text-[9px] text-white/40 uppercase tracking-widest font-black block">Live URL</span>
                          <a
                            href={deployment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] text-white bg-white/5 border border-white/10 px-2.5 py-1.5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 font-mono truncate"
                          >
                            <span>{deployment.url}</span>
                            <span className="text-[10px]">↗</span>
                          </a>
                        </div>
                      )}
                    </div>
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
