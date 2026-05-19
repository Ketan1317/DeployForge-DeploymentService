import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import FlowArt, { FlowSection } from './ui/story-scroll';

export const Login: React.FC = () => {
  const { login } = useAuth();

  return (
    <FlowArt aria-label="DeployForge Login">
      {/* Section 1 - Intro */}
      <FlowSection aria-label="Who we are" style={{ backgroundColor: '#000', color: '#fff' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em]">01 — Welcome to DeployForge</p>
        <hr className="my-[2vw] border-none border-t border-white/20 opacity-100" />
        <div>
          <h1
            className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight"
          >
            Deploy
            <br />
            Without
            <br />
            Limits
          </h1>
        </div>
        <hr className="my-[2vw] border-none border-t border-white/20 opacity-100" />
        <p className="mt-auto max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
          We believe every developer deserves a deployment platform that puts speed and simplicity first. No server setup, no scaling headaches — just pure code, deployed instantly.
        </p>
      </FlowSection>

      {/* Section 2 - Core Features */}
      <FlowSection aria-label="La mission" style={{ backgroundColor: '#0a0a0f', color: '#fff' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em]">02 — The Platform</p>
        <hr className="my-[2vw] border-none border-t border-white/10" />
        <div>
          <h2
            className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight"
          >
            Speed
            <br />
            First
            <br />
            Always
          </h2>
        </div>
        <hr className="my-[2vw] border-none border-t border-white/10" />
        <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed text-white/90">
          A modern deployment engine built for next-generation web apps. We&apos;re rewriting the rules of how development teams build, deploy, and scale.
        </p>
        <hr className="my-[2vw] border-none border-t border-white/10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[3vw]">
          <div className="min-w-[180px]">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-white">Deployments</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              One-click setups directly linked to your Git repository. Commit code, and we handle the rest automatically.
            </p>
          </div>
          <div className="min-w-[180px]">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-white">Global Edge</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Your applications are delivered from a high-performance proxy routing system for lightning-fast loads.
            </p>
          </div>
          <div className="min-w-[180px]">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-white">Secure Auth</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Seamless developer access. Standard OAuth connection with GitHub ensures your project code remains safe.
            </p>
          </div>
        </div>
        <hr className="my-[2vw] border-none border-t border-white/10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[3vw]">
          <div className="min-w-[180px]">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-white">Real-time Logs</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Follow every build step as it runs. Watch your static builds progress live in the browser.
            </p>
          </div>
          <div className="min-w-[180px]">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-white">Isolated Builds</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Every deployment is built in a sandboxed, isolated environment, ensuring security and stability.
            </p>
          </div>
          <div className="min-w-[180px]">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-white">Scale Limits</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              From personal pet projects to team services, scale dynamically without manual server configurations.
            </p>
          </div>
        </div>
        <hr className="my-[2vw] border-none border-t border-white/10" />
        <p className="mt-auto ml-auto max-w-[50ch] text-right text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed text-white/70">
          Every line of code we compile starts with one question — how can we build it faster?
        </p>
      </FlowSection>

      {/* Section 3 - Process */}
      <FlowSection aria-label="Comment ça marche" style={{ backgroundColor: '#F5F0E8', color: '#000' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em]">03 — How it works</p>
        <hr className="my-[2vw] border-none border-t border-black/10" />
        <div>
          <h2
            className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight"
          >
            Push.
            <br />
            Build.
            <br />
            Live.
          </h2>
        </div>
        <hr className="my-[2vw] border-none border-t border-black/10" />
        <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed text-black/85">
          Three simple steps. Zero configuration overhead. Your project goes live the moment you deploy.
        </p>
        <hr className="my-[2vw] border-none border-t border-black/10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[3vw]">
          <div className="min-w-[180px]">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-black">01 — Connect</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Log in with your GitHub account. No new passwords to remember, secure OAuth credentials.
            </p>
          </div>
          <div className="min-w-[180px]">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-black">02 — Configure</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Enter your repository Git URL, project title, and target connection configurations.
            </p>
          </div>
          <div className="min-w-[180px]">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-black">03 — Deploy</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Hit deploy and watch your terminal outputs stream in real-time. Your app is live in seconds.
            </p>
          </div>
        </div>
        <hr className="my-[2vw] border-none border-t border-black/10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[3vw]">
          <div className="min-w-[180px]">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-black">04 — Live Logs</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Inspect logs instantly. Our backend keeps you informed of compilation steps, errors, and output.
            </p>
          </div>
          <div className="min-w-[180px]">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-black">05 — Domains</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Every project receives a dedicated public hostname routed directly through our proxy system.
            </p>
          </div>
          <div className="min-w-[180px]">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-black">06 — Manage</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Re-verify build states, access active project URLs, and deploy code additions effortlessly.
            </p>
          </div>
        </div>
      </FlowSection>

      {/* Section 4 - Stats */}
      <FlowSection aria-label="La vision" style={{ backgroundColor: '#111', color: '#fff' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em]">04 — Our Performance</p>
        <hr className="my-[2vw] border-none border-t border-white/10" />
        <div>
          <h2
            className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight"
          >
            Proven
            <br />
            Scale
          </h2>
        </div>
        <hr className="my-[2vw] border-none border-t border-white/10" />
        <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed text-white/90">
          We build infrastructure that stands strong under pressure, handling load balances with high response speeds.
        </p>
        <hr className="my-[2vw] border-none border-t border-white/10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[3vw]">
          <div className="min-w-[180px]">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-white">100%</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Automated pipelines. No manual virtual machine setup or operating system configs needed.
            </p>
          </div>
          <div className="min-w-[180px]">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-white">⚡ Instant</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Redirection via our reverse-proxy server. Fast client handshake and data delivery.
            </p>
          </div>
          <div className="min-w-[180px]">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-white">0-Config</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Built on clean conventions. Connect your repository, choose a project name, and run.
            </p>
          </div>
        </div>
        <hr className="my-[2vw] border-none border-t border-white/10" />
        <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed text-white/70">
          Traditional web hosts take hours to build and hook up TLS certificates. We complete the setup instantly, ensuring zero down time.
        </p>
      </FlowSection>

      {/* Section 5 - Join / Auth Button */}
      <FlowSection aria-label="Nous rejoindre" style={{ backgroundColor: '#000', color: '#fff' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em]">05 — Join DeployForge</p>
        <hr className="my-[2vw] border-none border-t border-white/10" />
        <div>
          <h2
            className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight"
          >
            Ready
            <br />
            To
            <br />
            Begin?
          </h2>
        </div>
        <hr className="my-[2vw] border-none border-t border-white/10" />
        
        <div className="flex flex-col items-start gap-6 mt-4">
          <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed opacity-90">
            Take control of your build cycle today. Connect your GitHub repository to launch your first service.
          </p>

          <button
            onClick={login}
            className="group flex items-center gap-4 bg-white text-black hover:bg-neutral-200 px-8 py-5 text-xl font-extrabold uppercase tracking-widest rounded-none transition-all duration-300 transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] border border-transparent cursor-pointer"
          >
            <svg className="h-7 w-7 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Connect with GitHub
          </button>
        </div>

        <hr className="my-[2vw] border-none border-t border-white/10" />
        
        {/* Core items displayed inline matching style */}
        <div className="mt-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold uppercase tracking-widest text-white/50">
          <div className="flex items-center gap-2">🚀 One-Click Setup</div>
          <div className="flex items-center gap-2">🔐 Secure OAuth</div>
          <div className="flex items-center gap-2">📊 Live Monitoring</div>
          <div className="flex items-center gap-2">⚡ Speed-Optimized</div>
        </div>
      </FlowSection>
    </FlowArt>
  );
};
