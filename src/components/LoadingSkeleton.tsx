'use client';

import { Loader2 } from 'lucide-react';

interface LoadingSkeletonProps {
  title?: string;
}

export function LoadingSkeleton({ title }: LoadingSkeletonProps) {
  return (
    <div className="animate-in fade-in duration-200">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-64 bg-gray-100 rounded mt-2 animate-pulse" />
      </div>

      {/* Content skeleton */}
      <div className="p-6">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto" />
            {title && (
              <p className="mt-3 text-sm text-gray-500">{title}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="animate-in fade-in duration-200">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-64 bg-gray-100 rounded mt-2 animate-pulse" />
      </div>

      {/* Cards skeleton */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-16 bg-gray-100 rounded mt-3 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-gray-100 rounded mt-2 animate-pulse" />
                </div>
                <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
