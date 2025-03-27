import React from 'react';
import { Text } from '@/components/atoms/Typography';
import { Vetement } from '@/services/vetement/types';
interface ClothingPreviewProps {
  item: Vetement | null;
  type: string;
  label: string;
  icon: React.ReactNode;
}
const ClothingPreview: React.FC<ClothingPreviewProps> = ({
  item,
  type,
  label,
  icon
}) => {
  return;
};
export default ClothingPreview;