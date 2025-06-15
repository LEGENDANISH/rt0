import React from 'react';
import { ModuleCard } from './ModuleCard';
import { ModulesListProps } from '../types/moduleTypes';

export const ModulesList: React.FC<ModulesListProps> = ({
  modules,
  expandedModule,
  onToggleExpand,
  onAddVideo,
  onEditModule,
  onDeleteModule,
  onEditVideo,
  onDeleteVideo
}) => {
  if (modules.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400 mb-4">No modules found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {modules.map((module) => (
        <ModuleCard
          key={module.id}
          module={module}
          isExpanded={expandedModule === module.id}
          onToggleExpand={onToggleExpand}
          onAddVideo={onAddVideo}
          onEditModule={onEditModule}
          onDeleteModule={onDeleteModule}
          onEditVideo={onEditVideo}
          onDeleteVideo={onDeleteVideo}
        />
      ))}
    </div>
  );
};