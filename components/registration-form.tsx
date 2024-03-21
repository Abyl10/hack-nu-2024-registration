"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import RequiredSpan from "@/components/ui/label-required";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import {
  ArrowRightIcon,
  CrownIcon,
  Loader2,
  PersonStandingIcon,
  TrashIcon,
  UserPlusIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

const MAX_PARTICIPANTS = 4;
const unis = [
  { label: "NU", value: "nu" },
  { label: "AITU", value: "aitu" },
  { label: "ENU", value: "enu" },
  { label: "KBTU", value: "kbtu" },
  { label: "SDU", value: "sdu" },
  { label: "Other", value: "other" },
] as const;

const studyYears = [
  { label: "Foundation year", value: "found" },
  { label: "1st year Bachelor", value: "first" },
  { label: "2nd year Bachelor", value: "second" },
  { label: "3rd year Bachelor", value: "third" },
  { label: "4th year Bachelor", value: "forth" },
  { label: "Graduated Bachelor", value: "grad" },
] as const;

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_FILE_TYPES = ["pdf", "doc", "docx"];

function checkFileType(file: File) {
  if (file?.name) {
    const fileType = file.name.split(".").pop();
    if (fileType && ACCEPTED_FILE_TYPES.includes(fileType)) {
      return true;
    }
  }
  return false;
}

export function getSchema() {
  const participantSchema = z.object({
    name: z.string({ required_error: "Please enter the name" }).min(3),
    surname: z
      .string({ required_error: "Please enter the surname" })
      .min(3)
      .max(40),
    email: z
      .string({ required_error: "Please enter the email address" })
      .min(3)
      .email({ message: "Should be in email format. E.g: john@example.com" }),
    uni: z
      .string({
        required_error: "Please select your University",
      })
      .min(1, { message: "Please select your university" }),
    studyYear: z
      .string({
        required_error: "Please select your year of study",
      })
      .min(1, { message: "Please select your year of study" }),
    major: z.string({ required_error: "Please enter the major" }),
    cv: z
      .custom<FileList>()
      .transform((val) => {
        if (val instanceof File) return val;
        if (val instanceof FileList) return val[0];
        throw new Error("A file must be provided.");
      })
      .nullable()
      .optional()
      .refine((val) => {
        if (!val) return true;
        return val.size <= MAX_FILE_SIZE && checkFileType(val);
      }, "File size should be less than 5MB and should be a .pdf, .doc or .docx"),
    cert: z
      .custom<FileList>()
      .transform((val) => {
        if (val instanceof File) return val;
        if (val instanceof FileList) return val[0];
        return null;
      })
      .refine((val) => {
        if (!val) return true;
        return val.size <= MAX_FILE_SIZE && checkFileType(val);
      }, "File size should be less than 5MB and should be a .pdf, .doc or .docx"),
  });

  const formSchema = z.object({
    teamName: z
      .string({ required_error: "Please enter your team name" })
      .min(2),
    teammates: z
      .array(participantSchema, {
        required_error: "You need at least 2 participants in your team",
      })
      .min(2)
      .max(MAX_PARTICIPANTS),
    acceptToS: z.literal<boolean>(true),
  });

  return { formSchema, participantSchema };
}

export default function RegistrationForm() {
  const { toast } = useToast();
  const { formSchema, participantSchema } = getSchema();
  const [teammatesCount, setTeammatesCount] = useState(1);
  const [submitLoading, setSubmitLoading] = useState(false);

  const emptyTeamMember: z.infer<typeof participantSchema> = {
    name: "",
    surname: "",
    email: "",
    uni: "",
    studyYear: "",
    major: "",
    cv: null,
    cert: null,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      teammates: [emptyTeamMember, emptyTeamMember],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmitLoading(true);

      console.log(values);
      let allDocumentsUploaded = true;

      const formData = new FormData();
      formData.append("team_name", values.teamName);

      values.teammates.forEach((teammate, index) => {
        const prefix = index === 0 ? "captain" : `member${index + 1}`;
        formData.append(`${prefix}_name`, teammate.name);
        formData.append(`${prefix}_surname`, teammate.surname);
        formData.append(`${prefix}_email`, teammate.email);
        formData.append(`${prefix}_uni`, teammate.uni);
        formData.append(`${prefix}_year`, teammate.studyYear);
        formData.append(`${prefix}_major`, teammate.major);

        if (teammate.cv) {
          formData.append(`${prefix}_CV`, teammate.cv);
        }
        if (!teammate.cert) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "Please upload the confirmation document for all participants.",
          });
          allDocumentsUploaded = false;
          return;
        } else {
          formData.append(`${prefix}_confirmation`, teammate.cert);
        }
      });
      console.log(formData);

      if (!allDocumentsUploaded) {
        return;
      }

      const response = await axios.post(
        `https://api.nuacm.kz/api/register/`,
        formData
      );

      // Check if the response status indicates success
      if (response.status >= 200 && response.status < 300) {
        toast({
          variant: "default",
          title: "Success! 🎉",
          description: "Your data has been submitted successfully.",
        });
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      let errorMessage = "There was a problem with your request.";
      if (error instanceof AxiosError) {
        if (error && error.message === "Network Error") {
          errorMessage =
            "Network error. Please check your internet connection.";
        } else if (error.response) {
          if (
            error.response.status === 400 &&
            error.response.data.team_name &&
            error.response.data.team_name[0] ===
              "team with this team name already exists."
          ) {
            errorMessage =
              "The team name you've chosen already exists. Please choose a different name.";
            form.setError("teamName", {
              type: "manual",
              message: errorMessage,
            });
          } else {
            errorMessage = error.response.data.message || errorMessage;
          }
        }
        console.error(error.message);
        // ... other error handling logic
      } else {
        console.error("Unknown error:", error);
      }
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: errorMessage,
      });
    } finally {
      setSubmitLoading(false);
    }
  }

  const { fields, append, remove } = useFieldArray({
    name: "teammates",
    control: form.control,
    rules: {
      minLength: 2,
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    fieldName: string
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const updatedFile = files[0];
      console.log(updatedFile);
      form.setValue(
        `teammates.${index}.${
          fieldName as keyof z.infer<typeof participantSchema>
        }`,
        updatedFile as File,
        { shouldValidate: true }
      );
    }
  };

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
                {/* {!online && <RequiredSpan />} */}
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

        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold flex items-center">
                {index === 0 ? (
                  <CrownIcon className="w-5 h-5 mr-2" />
                ) : (
                  <PersonStandingIcon className="w-5 h-5 mr-2" />
                )}
                {index === 0 ? `Captain` : `Participant #${index + 1}`}
              </CardTitle>
              <Button
                size="icon"
                variant="destructive"
                disabled={index === 0 || index == 1}
                onClick={() => {
                  remove(index);
                  setTeammatesCount((prev) => prev - 1);
                }}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex gap-4 w-full justify-between">
                <FormField
                  control={form.control}
                  name={`teammates.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="w-full">
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
                    <FormItem className="w-full">
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
              </div>

              <FormField
                control={form.control}
                name={`teammates.${index}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email
                      <RequiredSpan />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`teammates.${index}.uni`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      University <RequiredSpan />
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select University" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {unis.map((uni, index) => (
                          <SelectItem key={index} value={uni.value}>
                            {uni.label}
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
                name={`teammates.${index}.studyYear`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Year of study <RequiredSpan />
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year of study" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {studyYears.map((item, index) => (
                          <SelectItem key={index} value={item.value}>
                            {item.label}
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
                name={`teammates.${index}.major`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Major
                      <RequiredSpan />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Computer Science" {...field} />
                    </FormControl>
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
                      CV/Resume (Optional)
                      {/* <RequiredSpan /> */}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Please upload your CV/Resume"
                        type="file"
                        onChange={(e) => {
                          console.log(e.target.files);
                          console.log(field);
                          handleFileChange(e, index, "cv");
                        }}
                      />
                      {/* <FileUpload
                        endpoint="cvUpload"
                        onChange={(url) => {
                          form.setValue(`teammates.${index}.cv`, url);
                          console.log(form);
                        }}
                      /> */}
                    </FormControl>
                    <FormDescription>
                      Upload your CV to be shared with our sponsors for
                      potential employment opportunities.
                    </FormDescription>
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
                      {<RequiredSpan />}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        placeholder="Please upload your enrollment verification"
                        onChange={(e) => {
                          console.log(e.target.files);
                          console.log(field);
                          handleFileChange(e, index, "cert");
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      You can attach enrollment verification with graduation
                      date, official/unofficial transcript or Spravka. Must have
                      a date of Feburary 2024 or later.
                    </FormDescription>
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
            Max {MAX_PARTICIPANTS} participants in one team
          </p>
        </div>

        <FormField
          control={form.control}
          name="acceptToS"
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

        <Button type="submit" disabled={submitLoading}>
          Submit
          {submitLoading ? (
            <Loader2 className="ml-2 w-4 h-4 animate-spin" />
          ) : (
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          )}
        </Button>

        {/* <Button
          onClick={() => {
            console.log(form.formState.errors);
          }}
        >
          Test Form State
        </Button> */}
      </form>
    </Form>
  );
}
