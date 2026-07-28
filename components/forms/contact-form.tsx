"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Slip } from "@/components/ui/button";
import { submitContact } from "@/lib/actions/contact";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import type { ActionState } from "@/types";

/** Grow a textarea to fit its content — the field expands as the user types. */
function autoGrow(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

/**
 * "See your blind spot" enquiry form.
 * React Hook Form + Zod for instant client validation; submission goes to the
 * `submitContact` Server Action, which re-validates and persists.
 */
export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      competitor: "",
      message: "",
      website: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState>({ status: "idle" });

  // The two starred fields gate the submit button — it stays disabled until
  // both carry a value, then unlocks.
  const [name, email] = watch(["name", "email"]);
  const canSubmit = Boolean(name?.trim()) && Boolean(email?.trim());

  // Auto-growing textareas: merge our measuring ref with the one RHF hands us.
  const messageReg = register("message");
  const contextReg = register("competitor");
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const contextRef = useRef<HTMLTextAreaElement | null>(null);

  function onSubmit(data: ContactInput) {
    setResult({ status: "idle" });
    startTransition(async () => {
      const response = await submitContact(data);
      setResult(response);
      if (response.status === "success") {
        reset();
        // Values are cleared — let the textareas fall back to their base height.
        requestAnimationFrame(() => {
          autoGrow(messageRef.current);
          autoGrow(contextRef.current);
        });
      }
    });
  }

  return (
    <form className="sb-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="form-legend">
        <span className="req">*</span> Required
      </p>

      <div className="field">
        <label className="field-label" htmlFor="contact-name">
          Your Name<span className="req">*</span>
        </label>
        <input
          id="contact-name"
          className="field-input"
          type="text"
          placeholder="Jane Smith"
          autoComplete="name"
          aria-required="true"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          {...register("name")}
        />
        {errors.name ? (
          <span id="contact-name-error" className="field-error" role="alert">
            {errors.name.message}
          </span>
        ) : null}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="contact-email">
          Work Email<span className="req">*</span>
        </label>
        <input
          id="contact-email"
          className="field-input"
          type="email"
          placeholder="jane@company.com"
          autoComplete="email"
          aria-required="true"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          {...register("email")}
        />
        {errors.email ? (
          <span id="contact-email-error" className="field-error" role="alert">
            {errors.email.message}
          </span>
        ) : null}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="contact-company">
          Company
        </label>
        <input
          id="contact-company"
          className="field-input"
          type="text"
          placeholder="Acme Technologies"
          autoComplete="organization"
          aria-invalid={Boolean(errors.company)}
          aria-describedby={
            errors.company ? "contact-company-error" : undefined
          }
          {...register("company")}
        />
        {errors.company ? (
          <span id="contact-company-error" className="field-error" role="alert">
            {errors.company.message}
          </span>
        ) : null}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="contact-message">
          What are you trying to understand about your market?
        </label>
        <textarea
          id="contact-message"
          className="field-textarea"
          placeholder="e.g. Why are customers choosing competitors over us?"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
          {...messageReg}
          ref={(el) => {
            messageReg.ref(el);
            messageRef.current = el;
          }}
          onInput={(e) => autoGrow(e.currentTarget)}
        />
        {errors.message ? (
          <span id="contact-message-error" className="field-error" role="alert">
            {errors.message.message}
          </span>
        ) : null}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="contact-context">
          Additional context <span className="app">(optional)</span>
        </label>
        <textarea
          id="contact-context"
          className="field-textarea"
          placeholder="Tell us anything that helps us understand your business."
          aria-invalid={Boolean(errors.competitor)}
          aria-describedby={
            errors.competitor ? "contact-context-error" : undefined
          }
          {...contextReg}
          ref={(el) => {
            contextReg.ref(el);
            contextRef.current = el;
          }}
          onInput={(e) => autoGrow(e.currentTarget)}
        />
        {errors.competitor ? (
          <span id="contact-context-error" className="field-error" role="alert">
            {errors.competitor.message}
          </span>
        ) : null}
      </div>

      {/* honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hp-field"
        {...register("website")}
      />

      <div className="form-foot">
        <Slip
          type="submit"
          className="form-submit"
          disabled={isPending || !canSubmit}
        >
          {isPending ? "Sending…" : "See your blind spot  →"}
        </Slip>
        {result.status !== "idle" ? (
          <p
            className="form-status"
            data-state={result.status}
            role="status"
            aria-live="polite"
          >
            {result.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
