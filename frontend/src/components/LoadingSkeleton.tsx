import React from 'react';

interface LoadingSkeletonProps {
    count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 6 }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="card p-4 animate-pulse">
                    {/* Cover image skeleton */}
                    <div className="skeleton w-full h-48 mb-4 rounded-lg bg-gray-200 animate-pulse"></div>
                    
                    {/* Title skeleton */}
                    <div className="skeleton h-6 w-3/4 mb-2 bg-gray-200 animate-pulse"></div>
                    
                    {/* Author skeleton */}
                    <div className="skeleton h-4 w-1/2 mb-3 bg-gray-200 animate-pulse"></div>
                    
                    {/* Year skeleton */}
                    <div className="skeleton h-4 w-16 mb-3 bg-gray-200 animate-pulse"></div>
                    
                    {/* Tags skeleton */}
                    <div className="flex gap-2 mb-3">
                        <div className="skeleton h-6 w-16 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="skeleton h-6 w-20 rounded-full bg-gray-200 animate-pulse"></div>
                    </div>
                    
                    {/* Footer skeleton */}
                    <div className="mt-auto pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="skeleton h-3 w-24 bg-gray-200 animate-pulse"></div>
                            <div className="skeleton h-4 w-4 rounded bg-gray-200 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LoadingSkeleton;
