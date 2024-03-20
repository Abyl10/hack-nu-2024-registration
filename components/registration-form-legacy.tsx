"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  CrownIcon,
  Loader2,
  PersonStandingIcon,
  TrashIcon,
  UserPlusIcon,
} from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

const MIN_AGE = 16;

const unis = [
  { label: "NU", value: "nu" },
  { label: "AITU", value: "aitu" },
  { label: "KBTU", value: "kbtu" },
  { label: "SDU", value: "sdu" },
  { label: "School", value: "school" },
  { label: "Other", value: "other" },
] as const;
const studyYears = ["found", "1", "2", "3", "4", "grad", "school"] as const;

const MAX_PARTICIPANTS = 3;
const DRIVE_PREFIX = "https://drive.google.com/";

const participantSchema = z.object({
  name: z.string({ required_error: "Please enter the name" }).min(3),
  surname: z
    .string({ required_error: "Please enter the surname" })
    .min(3)
    .max(40),
  age: z.coerce
    .number({ required_error: "Please enter the age" })
    .min(MIN_AGE)
    .max(40),
  gender: z.enum(["male", "female", "other"], {
    invalid_type_error: "Select a gender",
    required_error: "Please select your gender",
  }),
  email: z
    .string({ required_error: "Please enter the email address" })
    .min(3)
    .email({ message: "Should be in email format. E.g: john@example.com" }),
  uni: z
    .string({
      required_error: "Please select your University/School",
    })
    .min(1, { message: "Please select your university" }),
  studyYear: z.enum(studyYears, {
    required_error: "Please select your year of study",
  }),
  cv: z
    .string({ required_error: "CV is required" })
    .min(3)
    .url()
    .startsWith(DRIVE_PREFIX, { message: "Must be a Google Drive Link" }),
  cert: z
    .string({ required_error: "This document is required" })
    .min(3)
    .url()
    .startsWith(DRIVE_PREFIX, { message: "Must be a Google Drive Link" }),
});

const formSchema = z.object({
  teamName: z.string({ required_error: "Please enter your team name" }).min(2),
  captain: participantSchema,
  teammates: z.array(participantSchema).optional(),
  participation_mode: z.literal<boolean>(true),
});

const emptyTeamMember: z.infer<typeof participantSchema> = {
  name: "",
  surname: "",
  age: MIN_AGE,
  gender: "other",
  email: "",
  uni: "",
  studyYear: "1",
  cv: "",
  cert: "",
};

function RequiredSpan() {
  return <span className="text-destructive font-bold"> *</span>;
}

export default function RegistrationFormLegacy() {
  const [teammatesCount, setTeammatesCount] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      captain: emptyTeamMember,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitLoading(true);
    // TODO: connect to backend
    // Take fields from value and assign them to fields per backend specification
    // JSON.stringify and place it into fetch() call body
    // wait for the result and then you can display success/failure with:
    // https://ui.shadcn.com/docs/components/toast
    // or
    // https://sonner.emilkowal.ski/
    const mode = "offline";
    console.log(values);
    setSubmitLoading(false);
  }

  const { fields, append, remove } = useFieldArray({
    name: "teammates",
    control: form.control,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="teamName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl font-bold">
                Team Name
                <RequiredSpan />
              </FormLabel>
              <FormControl>
                <Input placeholder="Abi, I have no idea" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display team name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
              <CrownIcon className="w-5 h-5 mr-2" />
              Captain
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="captain.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name
                    <RequiredSpan />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="captain.surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Surname
                    <RequiredSpan />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="captain.age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Age
                    <RequiredSpan />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="" inputMode="numeric" {...field} />
                  </FormControl>
                  <FormDescription>
                    16+ for Offline participation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="captain.gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Gender
                    <RequiredSpan />
                  </FormLabel>
                  <div className="relative w-max">
                    <FormControl>
                      <select
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "w-[200px] appearance-none bg-transparent font-normal"
                        )}
                        {...field}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other/Prefer not to say</option>
                      </select>
                    </FormControl>
                    <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 opacity-50" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="captain.uni"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    University/School
                    <RequiredSpan />
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? unis.find((uni) => uni.value === field.value)
                                ?.label
                            : "Select uni"}
                          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search uni..." />
                        <CommandEmpty>No University/School found.</CommandEmpty>
                        <CommandGroup>
                          {unis.map((uni) => (
                            <CommandItem
                              value={uni.label}
                              key={uni.value}
                              onSelect={() => {
                                form.setValue("captain.uni", uni.value);
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  uni.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {uni.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="captain.cv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    CV/Resume Link
                    <RequiredSpan />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://drive.google.com/" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="captain.cert"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Document proving study at an educational institution
                    <RequiredSpan />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://drive.google.com/" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold flex items-center">
                <PersonStandingIcon className="w-5 h-5 mr-2" />
                Participant #{index + 2}
              </CardTitle>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => {
                  remove(index);
                  setTeammatesCount((prev) => prev - 1);
                }}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name={`teammates.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name
                      <RequiredSpan />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`teammates.${index}.surname`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Surname
                      <RequiredSpan />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`teammates.${index}.age`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Age
                      <RequiredSpan />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="" inputMode="numeric" {...field} />
                    </FormControl>
                    <FormDescription>
                      16+ for Offline participation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`teammates.${index}.gender`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Gender
                      <RequiredSpan />
                    </FormLabel>
                    <div className="relative w-max">
                      <FormControl>
                        <select
                          className={cn(
                            buttonVariants({ variant: "outline" }),
                            "w-[200px] appearance-none bg-transparent font-normal"
                          )}
                          {...field}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other/Prefer not to say</option>
                        </select>
                      </FormControl>
                      <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 opacity-50" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`teammates.${index}.uni`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      University/School
                      <RequiredSpan />
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[200px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? unis.find((uni) => uni.value === field.value)
                                  ?.label
                              : "Select uni"}
                            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search uni..." />
                          <CommandEmpty>
                            No University/School found.
                          </CommandEmpty>
                          <CommandGroup>
                            {unis.map((uni) => (
                              <CommandItem
                                value={uni.label}
                                key={uni.value}
                                onSelect={() => {
                                  form.setValue("captain.uni", uni.value);
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    uni.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {uni.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`teammates.${index}.cv`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      CV/Resume Link
                      <RequiredSpan />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://drive.google.com/"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`teammates.${index}.cert`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Document proving study at an educational institution
                      <RequiredSpan />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://drive.google.com/"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}

        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            disabled={teammatesCount === MAX_PARTICIPANTS - 1}
            onClick={() => {
              append(emptyTeamMember);
              setTeammatesCount((prev) => prev + 1);
            }}
          >
            <UserPlusIcon className="mr-2 h-4 w-4" />
            Add Teammate
          </Button>
          <p className="text-muted-foreground text-xs mt-2">
            Max 3 participants in one team
          </p>
        </div>

        <FormField
          control={form.control}
          name="participation_mode"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I confirm that my team and I consent to our data being shared.
                </FormLabel>
                <FormDescription>
                  We understand that our data may be used for
                  competition-related purposes and will be handled with the
                  utmost care and confidentiality.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={submitLoading}>
            Submit
            {submitLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
