"use client";
import RegistrationForm from "@/components/registration-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LightbulbIcon } from "lucide-react";

export default function Home() {
  return (
    <section className="w-full max-w-xl space-y-8">
      <div>
        <h1 className="text-xl font-bold mb-2">Registration Form</h1>
        <h1 className="text-sm text-muted-foreground mb-2">
          Please fill out everything below.
        </h1>
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Before proceding</CardTitle>
            <LightbulbIcon className="h-6 w-6 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="mt-2 text-sm text-muted-foreground text-align-justify">
              Make sure that you uploaded your CV and University/School
              verification of <b>ALL MEMBERS</b> to file upload section.
            </p>
            <p className="mt-2 text-sm text-muted-foreground text-align-justify">
              Please note that the candidates with documents that are outdated
              (dated earlier than September 2023) will be rejected.
            </p>
            <p className="mt-2 text-sm text-muted-foreground text-align-justify">
              Note: data is not saved upon reloading the page.
            </p>
          </CardContent>
        </Card>
      </div>
      <RegistrationForm />
    </section>
  );
}
