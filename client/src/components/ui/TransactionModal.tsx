import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { closeModal } from "../../store/slices/uiSlice";
import {
  addTransaction,
  updateTransaction,
} from "../../store/slices/transactionsSlice";
import type { Transaction } from "../../store/slices/transactionsSlice";
import { Field } from "./Field";

const CATEGORIES = [
  "Food & Dining",
  "Shopping",
  "Transportation",
  "Entertainment",
  "Utilities",
  "Housing",
  "Healthcare",
  "Education",
  "Salary",
  "Investment",
  "Transfer",
  "Other",
];

const ACCOUNTS = ["Main Card", "Savings Card", "Travel Card"];

const EMPTY_FORM = {
  description: "",
  amount: "",
  type: "expense" as "income" | "expense",
  category: "Shopping",
  status: "completed" as Transaction["status"],
  account: "Main Card",
  date: new Date().toISOString().slice(0, 16),
  note: "",
};

const TransactionModal = () => {
  const dispatch = useAppDispatch();
  const { modalOpen, editingTransactionId } = useAppSelector((s) => s.ui);

  const transactions = useAppSelector((s) => s.transactions.data);

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const editing = editingTransactionId
    ? transactions.find((t) => t.id === editingTransactionId)
    : null;

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        description: editing.description,
        amount: String(editing.amount),
        type: editing.type,
        category: editing.category,
        status: editing.status,
        account: editing.account,
        date: editing.date.slice(0, 16),
        note: editing.note,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editingTransactionId, modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;

    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: "power2.out" },
    );

    gsap.fromTo(
      modalRef.current,
      { opacity: 0, y: 32, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" },
    );
  }, [modalOpen]);

  if (!modalOpen) return null;

  const handleClose = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      y: 20,
      scale: 0.97,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        dispatch(closeModal());
      },
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.account) <= 0)
      e.amount = "Enter a valid amount";
    if (!form.date) e.date = "Date is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setSubmitting(true);
    const payload = {
      ...form,
      amount: parseFloat(form.amount),
      date: new Date(form.date).toISOString(),
    };

    try {
      if (editing) {
        await dispatch(
          updateTransaction({ id: editing.id, data: payload }),
        ).unwrap();
      } else {
        await dispatch(addTransaction(payload)).unwrap();
      }
      handleClose();
    } catch (err) {
      console.error("Failed to save transaction:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const update = (key: string, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === overlayRef.current && handleClose()}
    >
      <div
        ref={modalRef}
        className="glass-card w-full max-w-lg"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <div
          className="flex items-center justify-between p-5"
          style={{ borderBottom: "1px solid var(--navy-border)" }}
        >
          <h2
            className="text-[18px] font-bold text-(--text-primary)"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            {editing ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{
              background: "var(--navy-border)",
              color: "var(--text-secondary)",
              border: "none",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            X
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="flex gap-2">
            {(["expense", "income"] as const).map((t) => (
              <button
                key={t}
                onClick={() => update("type", t)}
                className="flex-1 py-2 rounded-xl text-[13px] font-semibold capitalize transition-all"
                style={{
                  background:
                    form.type === t
                      ? t === "income"
                        ? "var(--emerald-muted)"
                        : "var(--red-muted)"
                      : "var(--navy)",
                  border: `1px solid ${
                    form.type === t
                      ? t === "income"
                        ? "var(--emerald)"
                        : "var(--red)"
                      : "var(--navy-border)"
                  }`,
                  color:
                    form.type === t
                      ? t === "income"
                        ? "var(--emerald)"
                        : "var(--red)"
                      : "var(--text-muted)",
                  cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {t === "income" ? "↑ Income" : "↓ Expense"}
              </button>
            ))}
          </div>

          <Field label="Description" error={errors.description}>
            <input
              type="text"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="e.g. Grocery Store"
            />
          </Field>
          <Field label="Amount (USD)" error={errors.amount}>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => update("amount", e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Account">
              <select
                value={form.account}
                onChange={(e) => update("account", e.target.value)}
              >
                {ACCOUNTS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
              >
                {["completed", "pending", "received", "failed"].map((s) => (
                  <option value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Date & Time" error={errors.date}>
              <input
                type="datetime-local"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Note (optional)">
            <input
              type="text"
              value={form.note}
              onChange={(e) => update("note", e.target.value)}
              placeholder="short note about this transaction"
            />
          </Field>
        </div>

        <div
          className="flex gap-3 p-5"
          style={{ borderTop: "1px solid var(--navy-border)" }}
        >
          <button
            onClick={handleClose}
            className="flex-1 py-2 rounded-xl text-[13px] font-medium transition-colors"
            style={{
              background: "var(--navy)",
              border: "1px solid var(--navy-border)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
            style={{
              background: submitting
                ? "var(--navy-border)"
                : "linear-gradient(135deg, var(--cyan), #0099CC",
              border: "none",
              color: submitting ? "var(--text-muted)" : "#0A0F1E",
              cursor: submitting ? "not-allowed" : "pointer",
              fontFamily: "Syne, sans-serif",
            }}
          >
            {submitting
              ? "Saving..."
              : editing
                ? "Save Changes"
                : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
