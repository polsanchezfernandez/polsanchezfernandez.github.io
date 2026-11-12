"use client";

import { useState } from "react";
import type { Field, Tipo } from "@/lib/schema";
import { saveAction, uploadAction } from "@/app/admin/actions";

type Data = Record<string, any>;

export default function ItemForm({
  tipo,
  fields,
  slug,
  initial,
}: {
  tipo: Tipo;
  fields: Field[];
  slug?: string;
  initial: Data;
}) {
  const [data, setData] = useState<Data>(initial);

  return (
    <form action={saveAction} className="form">
      <input type="hidden" name="tipo" value={tipo} />
      <input type="hidden" name="slugAnterior" value={slug ?? ""} />
      <input type="hidden" name="data" value={JSON.stringify(data)} />
      {tipo !== "perfil" && (
        <label className="field">
          <span>Dirección (slug)</span>
          <input name="slug" defaultValue={slug} placeholder="se genera del título si lo dejas vacío" />
        </label>
      )}
      <Fields fields={fields} value={data} onChange={setData} />
      <div className="form-actions">
        <button className="btn primary" type="submit">
          Guardar
        </button>
      </div>
    </form>
  );
}

function Fields({ fields, value, onChange }: { fields: Field[]; value: Data; onChange: (d: Data) => void }) {
  const set = (name: string, v: unknown) => onChange({ ...value, [name]: v });
  return (
    <>
      {fields.map((f) => (
        <FieldInput key={f.name} field={f} value={value[f.name]} onChange={(v) => set(f.name, v)} />
      ))}
    </>
  );
}

function FieldInput({ field: f, value, onChange }: { field: Field; value: any; onChange: (v: any) => void }) {
  const hint = "hint" in f && f.hint ? <small>{f.hint}</small> : null;
  switch (f.type) {
    case "textarea":
      return (
        <label className="field">
          <span>{f.label}</span>
          <textarea rows={5} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
          {hint}
        </label>
      );
    case "select":
      return (
        <label className="field">
          <span>{f.label}</span>
          <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
            <option value="">—</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      );
    case "check":
      return (
        <label className="field check">
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          <span>{f.label}</span>
        </label>
      );
    case "tags":
      return (
        <label className="field">
          <span>{f.label}</span>
          <input
            value={(value ?? []).join(", ")}
            onChange={(e) =>
              onChange(
                e.target.value
                  .split(",")
                  .map((s) => s.trimStart())
                  .filter((s, i, all) => s || i === all.length - 1),
              )
            }
          />
          {hint}
        </label>
      );
    case "image":
      return <ImageInput label={f.label} value={value} onChange={onChange} />;
    case "list":
      return <ListInput field={f} value={value ?? []} onChange={onChange} />;
    default:
      return (
        <label className="field">
          <span>{f.label}</span>
          <input
            type={f.type}
            value={value ?? ""}
            onChange={(e) => onChange(f.type === "number" ? Number(e.target.value) : e.target.value)}
          />
          {hint}
        </label>
      );
  }
}

function ImageInput({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  const [subiendo, setSubiendo] = useState(false);
  async function upload(file: File) {
    setSubiendo(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      onChange(await uploadAction(fd));
    } finally {
      setSubiendo(false);
    }
  }
  return (
    <div className="field">
      <span>{label}</span>
      <div className="image-input">
        {value && <img src={value} alt="" />}
        <div>
          <input value={value ?? ""} placeholder="URL o sube un archivo" onChange={(e) => onChange(e.target.value)} />
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          {subiendo && <small>Subiendo…</small>}
        </div>
      </div>
    </div>
  );
}

function ListInput({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { type: "list" }>;
  value: Data[];
  onChange: (v: Data[]) => void;
}) {
  const update = (i: number, d: Data) => onChange(value.map((v, j) => (j === i ? d : v)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const copy = [...value];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  };
  return (
    <fieldset className="list">
      <legend>{field.label}</legend>
      {value.map((item, i) => (
        <div className="list-item" key={i}>
          <div className="list-item-head">
            <strong>
              {field.itemLabel} {i + 1}
            </strong>
            <span>
              <button type="button" onClick={() => move(i, -1)} aria-label="Subir">↑</button>
              <button type="button" onClick={() => move(i, 1)} aria-label="Bajar">↓</button>
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))}>Quitar</button>
            </span>
          </div>
          <Fields fields={field.fields} value={item} onChange={(d) => update(i, d)} />
        </div>
      ))}
      <button type="button" className="btn" onClick={() => onChange([...value, {}])}>
        + Añadir {field.itemLabel.toLowerCase()}
      </button>
    </fieldset>
  );
}
