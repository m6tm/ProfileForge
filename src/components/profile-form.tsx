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
        title: "Success!",
        description: result.message,
      });
      onUpdate(data);
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not update profile. Please try again.",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>Manage your personal information. Fields marked with * are required.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
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
                    <Input placeholder="Your email" {...field} readOnly disabled />
                  </FormControl>
                  <FormDescription>Your email address is not editable.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
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
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://your-website.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <h3 className="mb-4 text-lg font-medium">Preferences</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="preferences.newsletter"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Newsletter</FormLabel>
                        <FormDescription>Receive updates about new features and content.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label="Toggle newsletter subscription"
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
                        <FormLabel className="text-base">Marketing Emails</FormLabel>
                        <FormDescription>Receive promotional emails and offers.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label="Toggle marketing email subscription"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" type="button" disabled={isSubmitting} onClick={() => form.reset(initialData)}>
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
