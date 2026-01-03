
export type HealthLevel = 'Healthy' | 'Mild Stress' | 'Moderate Stress' | 'High Stress';

export interface PlantReport {
  // 1. Plant Identification
  identification: {
    commonName: string;
    scientificName: string;
    category: string;
  };
  // 2. Growth Stage
  age: {
    growthStage: 'Seedling' | 'Young' | 'Mature' | 'Flowering' | 'Fruiting';
    description: string;
  };
  // 3. Health Status
  health: {
    status: HealthLevel;
    confidenceNote: string;
  };
  // 4. Visible Symptoms
  symptoms: string[];
  // 5. Water & Sunlight Assessment
  assessment: {
    water: string;
    sunlight: string;
  };
  // 6. Possible Nutrient Concerns
  nutrientConcerns: string[];
  // 7. Immediate Action Plan
  actionPlan: string[];
  // 8. Long-Term Care Tips
  longTermTips: string[];
  // 9. Growth & Recovery Timeline
  timeline: {
    stage: string;
    timeEstimation: string;
    details: string;
  }[];
  // 10. Disclaimer
  disclaimer: string;
  
  // Meta
  confidenceLevel: string;
}

export interface UserContext {
  lastWatered: string;
  placement: 'Indoor' | 'Outdoor';
  plantingType: 'Potted' | 'Ground';
  isRescan: boolean;
  location?: {
    lat: number;
    lng: number;
    city?: string;
  };
}

export type AppMode = 'idle' | 'context' | 'scanning' | 'analyzing' | 'result';
