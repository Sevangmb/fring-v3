
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModifierEnsembleFormData } from "@/hooks/ensembles/useModifierEnsemble";

interface EnsembleFormFieldsProps {
  formData: ModifierEnsembleFormData;
  onChange: (field: keyof Omit<ModifierEnsembleFormData, 'selectedItems'>, value: string) => void;
}

const EnsembleFormFields: React.FC<EnsembleFormFieldsProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="nom">Nom de l'ensemble</Label>
        <Input 
          id="nom" 
          value={formData.nom} 
          onChange={e => onChange('nom', e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={formData.description} 
          onChange={e => onChange('description', e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="occasion">Occasion</Label>
          <Select value={formData.occasion} onValueChange={value => onChange('occasion', value)}>
            <SelectTrigger id="occasion">
              <SelectValue placeholder="Choisir une occasion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Aucune</SelectItem>
              <SelectItem value="Casual">Casual</SelectItem>
              <SelectItem value="Sport">Sport</SelectItem>
              <SelectItem value="Formel">Formel</SelectItem>
              <SelectItem value="Soirée">Soirée</SelectItem>
              <SelectItem value="Travail">Travail</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="saison">Saison</Label>
          <Select value={formData.saison} onValueChange={value => onChange('saison', value)}>
            <SelectTrigger id="saison">
              <SelectValue placeholder="Choisir une saison" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Aucune</SelectItem>
              <SelectItem value="Printemps">Printemps</SelectItem>
              <SelectItem value="Été">Été</SelectItem>
              <SelectItem value="Automne">Automne</SelectItem>
              <SelectItem value="Hiver">Hiver</SelectItem>
              <SelectItem value="Toutes saisons">Toutes saisons</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default EnsembleFormFields;
