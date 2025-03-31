
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <Layout>
      <div className="container max-w-md mx-auto px-4 py-6 pb-20">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Study Preferences</CardTitle>
            <CardDescription>
              Customize how you want to study
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-goal">Daily Goal</Label>
              <Select defaultValue="20">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Cards per day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 cards</SelectItem>
                  <SelectItem value="20">20 cards</SelectItem>
                  <SelectItem value="30">30 cards</SelectItem>
                  <SelectItem value="50">50 cards</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="audio-feedback">Audio Feedback</Label>
              <Switch id="audio-feedback" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-examples">Show Examples</Label>
              <Switch id="show-examples" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Manage notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-reminder">Daily Reminder</Label>
              <Switch id="daily-reminder" />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reminder-time">Reminder Time</Label>
              <Select defaultValue="18">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8:00 AM</SelectItem>
                  <SelectItem value="12">12:00 PM</SelectItem>
                  <SelectItem value="18">6:00 PM</SelectItem>
                  <SelectItem value="21">9:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the app's appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Theme</Label>
              <Select defaultValue="light">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="card-animations">Card Animations</Label>
              <Switch id="card-animations" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
