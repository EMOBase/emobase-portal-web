export type BundleJobStatus = "PENDING" | "RUNNING" | "DONE" | "FAILED";

/**
 * The subset of a bundle file's job the floating processing panel needs.
 * Bundle files come from the version/assembly detail response, where each
 * `FileDetail` carries its own jobs, so the panel no longer needs `GET /jobs`.
 */
export type BundleJob = {
  id: number;
  type: string;
  description: string;
  status: BundleJobStatus;
  payload?: any;
  error?: string | null;
};

export type BundleUploadItem = {
  id: string;
  name: string;
  progress: number;
  /**
   * UPLOADING - the archive is on the wire (client-side work).
   * UPLOADED  - the client-side upload is done, but the extraction job has
   *             not been listed by the next detail poll yet. A hand-off buffer
   *             that closes as soon as the job shows up - it is not a job row
   *             and must not read like one.
   * FAILED    - the upload itself failed; no extraction job will ever exist.
   */
  status: "UPLOADING" | "UPLOADED" | "FAILED";
  error?: string;
};

/**
 * A row of the panel's list: a live job, or one that just finished and is
 * still animating out.
 */
export type PanelJobRow =
  | {
      key: number;
      name: string;
      completed: false;
      status: BundleJobStatus;
      error: string | undefined;
      description: string | undefined;
    }
  | { key: number; name: string; completed: true };
