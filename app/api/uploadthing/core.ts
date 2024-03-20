import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  cvUpload: f(["pdf"]).onUploadComplete((data) => {
    console.log("cvUpload", data);
  }),

  certificateUpload: f(["pdf"]).onUploadComplete((data) => {
    console.log("certificateUpload", data);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
