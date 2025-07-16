"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { profileFormSchema, type UserProfile } from "@/lib/types";
import { updateProfile } from "@/lib/actions";

interface ProfileFormProps {
    initialData: UserProfile;
    onUpdate: (data: UserProfile) => void;
}

export function ProfileForm({ initialData, onUpdate }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<UserProfile>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData,
    mode: "onChange",
  });

  async function onSubmit(data: UserProfile) {
    setIsSubmitting(true);
    const result = await updateProfile(data);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Succès !",
        description: result.message,
      });
      onUpdate(data);
    } else {
      toast({
        variant: "destructive",
        title: "Oh oh ! Quelque chose s'est mal passé.",
        description: "Impossible de mettre à jour le profil. Veuillez réessayer.",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails du profil</CardTitle>
        <CardDescription>Gérez vos informations personnelles. Les champs marqués d'un * sont obligatoires.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet *</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom complet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre email" {...field} readOnly disabled />
                  </FormControl>
                  <FormDescription>Votre adresse e-mail n'est pas modifiable.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biographie *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Parlez-nous un peu de vous"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site web</FormLabel>
                  <FormControl>
                    <Input placeholder="https://votre-site-web.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <h3 className="mb-4 text-lg font-medium">Préférences</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="preferences.newsletter"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Newsletter</FormLabel>
                        <FormDescription>Recevez des mises à jour sur les nouvelles fonctionnalités et le contenu.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label="Basculer l'abonnement à la newsletter"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferences.marketing"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">E-mails marketing</FormLabel>
                        <FormDescription>Recevez des e-mails promotionnels et des offres.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label="Basculer l'abonnement aux e-mails marketing"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
              <Button variant="outline" type="button" disabled={isSubmitting} onClick={() => form.reset(initialData)}>
                Réinitialiser
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
