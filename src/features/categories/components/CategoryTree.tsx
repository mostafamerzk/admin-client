import React, { useMemo } from 'react';
import TreeView, { type TreeNode } from '../../../components/common/TreeView';
import type { Category } from '../types';

interface CategoryTreeProps {
  categories: Category[];
  onCategorySelect: (category: Category) => void;
  selectedCategoryId?: string | undefined;
  className?: string;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  onCategorySelect,
  selectedCategoryId,
  className = ''
}) => {
  // Transform categories into tree structure
  const categoryTree = useMemo(() => {
    // Create a map for quick lookup
    const categoryMap = new Map<string, Category & { children: Category[] }>();
    
    // Initialize each category with an empty children array
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });
    
    // Build the tree structure
    const rootCategories: (Category & { children: Category[] })[] = [];
    
    categoryMap.forEach(category => {
      if (category.parentId) {
        // This is a child category
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children.push(category);
        } else {
          // Parent not found, add to root
          rootCategories.push(category);
        }
      } else {
        // This is a root category
        rootCategories.push(category);
      }
    });
    
    return rootCategories;
  }, [categories]);
  
  // Transform to TreeNode format
  const treeData: TreeNode[] = useMemo(() => {
    const mapCategoryToTreeNode = (
      category: Category & { children: Category[] }
    ): TreeNode => ({
      id: category.id,
      name: category.name,
      children: category.children.map(child => mapCategoryToTreeNode({ ...child, children: [] })),
      originalData: category
    });
    
    return categoryTree.map((root) => mapCategoryToTreeNode(root));
  }, [categoryTree]);
  
  const handleNodeSelect = (node: TreeNode) => {
    onCategorySelect(node['originalData']);
  };
  return (
    <TreeView
      data={treeData}
      onNodeSelect={handleNodeSelect}
      selectedNodeId={selectedCategoryId || ''}
      className={className}
    />
  );
};

export default CategoryTree;
