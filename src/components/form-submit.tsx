"use client";

import { useFormStatus } from "react-dom";

export default function FormSubmit() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <p>Creating post...</p>
      ) : (
        <>
          <button type="reset">Reset</button>
          <button>Create Post</button>
        </>
      )}
    </>
  );
}
