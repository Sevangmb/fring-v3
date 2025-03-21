
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

/**
 * Interface for detection strategy
 * Allows for different approaches to detecting clothing information
 */
export interface DetectionStrategy {
  detect(imageUrl: string, hf: HfInference): Promise<{color: string, category: string}>;
}
