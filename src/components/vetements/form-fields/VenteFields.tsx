
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues, etatOptions, disponibiliteOptions } from "../schema/VetementFormSchema";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CircleDollarSign, Tag, PercentIcon } from "lucide-react";

interface VenteFieldsProps {
  form: UseFormReturn<VetementFormValues>;
}

const VenteFields: React.FC<VenteFieldsProps> = ({ form }) => {
  const aVendre = form.watch("a_vendre");
  const prixAchat = form.watch("prix_achat");
  const prixVente = form.watch("prix_vente");

  // Calculer la marge
  const calculerMarge = () => {
    if (!prixAchat || !prixVente) return null;
    return prixVente - prixAchat;
  };

  const marge = calculerMarge();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="a_vendre"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Mettre en vente
              </FormLabel>
              <FormDescription>
                Activer pour mettre ce vêtement en vente
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {aVendre && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="prix_achat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix d'achat (€)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number"
                        placeholder="Prix d'achat"
                        className="pl-10"
                        {...field} 
                        onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                        value={field.value === null || field.value === undefined ? '' : field.value}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prix_vente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix de vente (€)*</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number"
                        placeholder="Prix de vente"
                        className="pl-10"
                        {...field} 
                        onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                        value={field.value === null || field.value === undefined ? '' : field.value}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {prixAchat !== null && prixVente !== null && marge !== null && (
            <div className="p-3 rounded-md border bg-muted/10 flex justify-between items-center">
              <span>Marge:</span>
              <span className={`font-medium ${marge > 0 ? 'text-green-600' : marge < 0 ? 'text-red-600' : ''}`}>
                {marge.toFixed(2)} €
              </span>
            </div>
          )}

          <FormField
            control={form.control}
            name="promo_pourcentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Réduction (%)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <PercentIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="number"
                      placeholder="Pourcentage de réduction"
                      className="pl-10"
                      min="0"
                      max="100"
                      {...field} 
                      onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      value={field.value === null || field.value === undefined ? '' : field.value}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Laissez vide pour ne pas appliquer de réduction
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="etat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>État</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value || null)}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un état" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {etatOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="disponibilite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disponibilité</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || "disponible"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la disponibilité" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {disponibiliteOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="lieu_vente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lieu de vente</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Lieu de vente (ex: Paris, Vinted, etc.)"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="infos_vente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Informations supplémentaires</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Informations supplémentaires sur la vente"
                    rows={3}
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
};

export default VenteFields;
