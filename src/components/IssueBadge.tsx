import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { SEOIssue } from '../types/seo';

interface IssueBadgeProps {
  severity: SEOIssue['severity'];
}

export const IssueBadge: React.FC<IssueBadgeProps> = ({ severity }) => {
  switch (severity) {
    case 'Critical':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400">
          <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
          <span>Critical</span>
        </span>
      );
    case 'High':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400">
          <AlertTriangle className="h-3.5 w-3.5 text-orange-500 shrink-0" />
          <span>High Priority</span>
        </span>
      );
    case 'Medium':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span>Medium</span>
        </span>
      );
    case 'Low':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-400">
          <Info className="h-3.5 w-3.5 text-sky-400 shrink-0" />
          <span>Low</span>
        </span>
      );
    case 'Informational':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>Notice</span>
        </span>
      );
  }
};
