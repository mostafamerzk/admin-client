import React, { useState } from 'react';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  [key: string]: any;
}

interface TreeViewProps {
  data: TreeNode[];
  onNodeSelect: (node: TreeNode) => void;
  selectedNodeId?: string;
  className?: string;
}

const TreeView: React.FC<TreeViewProps> = ({
  data,
  onNodeSelect,
  selectedNodeId,
  className = ''
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  
  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };
  
  const renderNode = (node: TreeNode, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes[node.id];
    const isSelected = node.id === selectedNodeId;
    
    return (
      <div key={node.id}>
        <div 
          className={`flex items-center py-2 px-3 hover:bg-gray-100 cursor-pointer ${
            isSelected ? 'bg-primary bg-opacity-10 text-primary' : ''
          }`}
          style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="mr-1 p-1 rounded-full hover:bg-gray-200 focus:outline-none"
            >
              {isExpanded ? (
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 text-gray-500" />
              )}
            </button>
          ) : (
            <span className="w-6" /> // Spacer for alignment
          )}
          
          <div 
            className="flex-1 truncate"
            onClick={() => onNodeSelect(node)}
          >
            {node.name}
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className={`border rounded-md overflow-hidden ${className}`}>
      {data.map(node => renderNode(node))}
    </div>
  );
};

export default TreeView;