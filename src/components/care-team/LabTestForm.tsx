"use client";

import { useState, type FormEvent } from "react";
import { Field } from "@/components/ui/Field";
import { careLine, labTestCopy as c } from "@/data/care-team";
import { Choice, DialogTitle, HeaderClose, PrimaryAction } from "./CareParts";

export type LabTestDetails = { name: string; age: string; gender: string };

/** W9.02 Lab test · Form (M9.02 is a centred dialog on mobile, not a sheet). Next: W9.03 request a callback. */
export function LabTestForm({
  initial,
  onClose,
  onNext,
}: {
  initial: LabTestDetails;
  onClose: () => void;
  onNext: (details: LabTestDetails) => void;
}) {
  const [d, setD] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof LabTestDetails, string>>>({});

  function submit(e: FormEvent) {
    e.preventDefault();
    const age = Number(d.age);
    const next = {
      name: d.name.trim() ? undefined : c.errors.name,
      age: d.age && age > 0 && age < 120 ? undefined : c.errors.age,
      gender: d.gender ? undefined : c.errors.gender,
    };
    setErrors(next);
    if (!next.name && !next.age && !next.gender) onNext({ ...d, name: d.name.trim() });
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6 px-5 py-6">
      <div className="flex items-start gap-3 md:items-center md:gap-2">
        <DialogTitle title={c.title} subtitle={c.subtitle} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="state flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-muted md:hidden"
        >
          <img src="/icons/icon-add-20.svg" alt="" className="size-5 -rotate-45" />
        </button>
        <HeaderClose onClick={onClose} className="hidden md:flex" />
      </div>

      <div className="flex flex-col gap-4">
        <Field
          label={c.nameLabel}
          placeholder={c.namePlaceholder}
          autoComplete="name"
          value={d.name}
          error={errors.name}
          onChange={(e) => {
            setD({ ...d, name: e.target.value });
            setErrors({ ...errors, name: undefined });
          }}
        />
        {/* Labels on one row, controls on the next, so the choices stretch to the field height. */}
        <div className="grid grid-cols-[96px_1fr] gap-x-3 gap-y-2">
          <label htmlFor="lab-age" className="text-b14 font-medium text-ink">
            {c.ageLabel}
          </label>
          <span id="lab-gender" className="text-b14 font-medium text-ink">
            {c.genderLabel}
          </span>
          <Field
            id="lab-age"
            inputMode="numeric"
            value={d.age}
            error={errors.age}
            onChange={(e) => {
              setD({ ...d, age: e.target.value.replace(/\D/g, "").slice(0, 3) });
              setErrors({ ...errors, age: undefined });
            }}
          />
          <div className="flex flex-col gap-1.5">
            <div role="radiogroup" aria-labelledby="lab-gender" className="flex h-[52px] gap-2">
              {c.genders.map((g) => (
                <Choice
                  key={g}
                  selected={d.gender === g}
                  onClick={() => {
                    setD({ ...d, gender: g });
                    setErrors({ ...errors, gender: undefined });
                  }}
                  className="min-w-0 flex-1 text-b14 font-medium"
                >
                  {g}
                </Choice>
              ))}
            </div>
            {errors.gender && <p className="text-b12 text-danger">{errors.gender}</p>}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <PrimaryAction>{c.submit}</PrimaryAction>
        <p className="flex items-center gap-2 text-b14 text-ink-2">
          {c.talkNow}
          <a href={careLine.tel} className="state flex items-center gap-1 rounded font-semibold text-link">
            <img src="/icons/icon-call-link-16.svg" alt="" className="size-4" />
            {c.callUs}
          </a>
        </p>
      </div>
    </form>
  );
}
