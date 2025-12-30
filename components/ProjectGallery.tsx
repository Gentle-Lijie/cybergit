
import React from 'react';
import { AnalysisResult } from '../types';
import { TagSphere } from './TagSphere';
import { Star, GitFork, HardDrive, Hash, Lock, Globe, Layers } from 'lucide-react';
import { Translations } from '../translations';

interface ProjectGalleryProps {
  analysis: AnalysisResult;
  t: Translations;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ analysis, t }) => {
  return (
    <section className="space-y-6">
      {/* Main Section Header */}
      <div className="flex items-center gap-4">
        <div className="h-[1px] flex-grow bg-primary/20" />
        <h3 className="text-primary font-bold tracking-widest text-sm uppercase flex items-center gap-2">
          <Layers className="w-4 h-4" />
          {t.projects.title}
        </h3>
        <div className="h-[1px] flex-grow bg-primary/20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Repositories List */}
        <div className="md:col-span-2 bg-surface-dark border border-primary/20 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-primary font-bold tracking-widest text-sm uppercase flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  {t.projects.topRepos}
              </h3>
              <div className="text-[10px] text-gray-500 uppercase">{t.projects.sortedBy}</div>
            </div>
            
            <div className="space-y-3">
              {analysis.topReposList.map((repo, idx) => (
                <a 
                  key={idx} 
                  href={repo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-black/40 border border-white/5 p-4 hover:border-primary/40 transition-all group flex items-start justify-between hover:bg-white/5 block cursor-pointer"
                >
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                          <div className="shrink-0">
                            {repo.isPrivate ? <Lock className="w-3 h-3 text-yellow-500" /> : <Globe className="w-3 h-3 text-gray-500" />}
                          </div>
                          <span className="text-white font-bold group-hover:text-primary transition-colors underline-offset-4 group-hover:underline decoration-primary/50 truncate block">{repo.name}</span>
                          {repo.primaryLanguage && (
                              <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.5 rounded bg-white/5 shrink-0" style={{ color: repo.primaryLanguage.color }}>
                                  {repo.primaryLanguage.name}
                              </span>
                          )}
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{repo.description || t.projects.noDesc}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono pl-4 shrink-0">
                      <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-3 h-3" /> {repo.stargazerCount}
                      </div>
                      <div className="flex items-center gap-1 text-blue-400">
                          <GitFork className="w-3 h-3" /> {repo.forkCount}
                      </div>
                    </div>
                </a>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-primary/10 flex justify-between text-[10px] text-gray-600 font-mono">
              <span>{t.projects.avgSize}: {(analysis.avgRepoSize / 1024).toFixed(1)} MB</span>
              <span>{t.projects.visibility}: {Math.round((1 - analysis.privateRepoRatio) * 100)}% {t.projects.public} / {Math.round(analysis.privateRepoRatio * 100)}% {t.projects.private}</span>
            </div>
        </div>

        {/* Topic Art Cloud */}
        <div className="md:col-span-1 bg-surface-dark border border-primary/20 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full p-4 z-10 bg-gradient-to-b from-surface-dark to-transparent">
              <div className="flex items-center gap-2">
                <Hash className="text-primary w-4 h-4" />
                <h3 className="text-primary font-bold tracking-widest text-sm uppercase">{t.projects.topicCloud}</h3>
              </div>
            </div>
            
            <div className="flex-grow h-full w-full">
               <TagSphere tags={analysis.topTopics} t={t} />
            </div>
        </div>
      </div>
    </section>
  );
};
