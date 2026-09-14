import { useState, useEffect } from "react";
import { Plus, Trash2, CircleDollarSign } from "lucide-react";
import "./App.css";
import { FREQUENCIES, MONTH_OPTIONS } from "./constants";
import { T } from "./translations";
import { uid } from "./utils";
import {
  monthWord,
  freqLabel,
  freqPerYear,
  eur,
  daysUntil,
  nextDateLabel,
} from "./calculations";
import * as XLSX from "xlsx";
export default function PaymentLedger() {
  const [payments, setPayments] = useState([]);
  /*const [loaded, setLoaded] = useState(false);*/ /*για αναμνηση των δεδομενων του χρήστης*/
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("month");
  const [monthsInterval, setMonthsInterval] = useState(1);
  const [nextDate, setNextDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [error, setError] = useState("");
  const [lang, setLang] = useState("el");
  const t = T[lang];
  /*Αυτά τα δύο κρατάνε την λίστα χωρις αυτα τα use state σβήνεται κάθε τι μετα απο το κλείσιμο της σελίδας.
  /*
  useEffect(() => {
    try {
      const raw = localStorage.getItem("payments-list");
      if (raw) setPayments(JSON.parse(raw));
    } catch {
      // δεν υπάρχει ακόμη αποθηκευμένη λίστα, ξεκινάμε άδειοι
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("payments-list", JSON.stringify(payments));
    } catch {
      // αν η αποθήκευση αποτύχει (π.χ. private browsing), η λίστα μένει μόνο στη μνήμη
    }
  }, [payments, loaded]);
  */
  const addPayment = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount.replace(",", "."));
    if (!name.trim()) {
      setError(t.errorName);
      return;
    }
    if (!parsedAmount || parsedAmount <= 0) {
      setError(t.errorAmount);
      return;
    }
    setError("");
    setPayments((prev) =>
      [
        ...prev,
        {
          id: uid(),
          name: name.trim(),
          amount: parsedAmount,
          frequency,
          monthsInterval: frequency === "month" ? monthsInterval : undefined,
          nextDate,
        },
      ].sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate)),
    );
    setName("");
    setAmount("");
  };

  const removePayment = (id) =>
    setPayments((prev) => prev.filter((p) => p.id !== id));
  const yearlyTotal = payments.reduce(
    (sum, p) => sum + p.amount * freqPerYear(p),
    0,
  );
  const monthlyTotal = yearlyTotal / 12;
  const sixMonthTotal = yearlyTotal / 2;
  const exportExcel = () => {
    const rows = payments.map((p) => {
      const annual = p.amount * freqPerYear(p);
      return {
        [t.xlsxHeader[0]]: p.name,
        [t.xlsxHeader[1]]: p.amount,
        [t.xlsxHeader[2]]: freqLabel(p, t),
        [t.xlsxHeader[3]]: p.nextDate,
        [t.xlsxHeader[4]]: annual,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [[t.xlsxGrandTotalLabel, "", "", "", yearlyTotal]],
      { origin: -1 },
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t.xlsxFileName);

    XLSX.writeFile(
      workbook,
      `${t.xlsxFileName}-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };
  return (
    <div className="ledger-root">
      <h1 className="title heading">{t.title}</h1>
      <p className="subtitle">{t.subtitle}</p>
      <button
        onClick={() => setLang("el")}
        style={{ fontWeight: lang === "el" ? "bold" : "normal" }}
      >
        GR
      </button>
      <button
        onClick={() => setLang("en")}
        style={{ fontWeight: lang === "en" ? "bold" : "normal" }}
      >
        EN
      </button>
      <div className="totals">
        <div className="total-item">
          <div className="total-label">{t.monthly}</div>
          <div className="total-value heading">{eur(monthlyTotal, t)}</div>
        </div>
        <div className="total-item">
          <div className="total-label">{t.sixMonth}</div>
          <div className="total-value heading">{eur(sixMonthTotal, t)}</div>
        </div>
        <div className="total-item">
          <div className="total-label">{t.yearly}</div>
          <div className="total-value heading">{eur(yearlyTotal, t)}</div>
        </div>
      </div>
      <div className="grand-total">
        <span className="grand-total-label">{t.grandTotalLabel}</span>
        <span className="grand-total-value heading">{eur(yearlyTotal, t)}</span>
      </div>
      <div className="form-card">
        <p className="form-heading">{t.formHeading}</p>
        <form onSubmit={addPayment}>
          <div className="field-row">
            <div className="field" style={{ flex: 2 }}>
              <label htmlFor="name">{t.name}</label>
              <input
                id="name"
                type="text"
                placeholder={t.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="amount">{t.amount}</label>
              <input
                id="amount"
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="frequency">{t.frequency}</label>
              <select
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value="day">{t.freqDay}</option>
                <option value="week">{t.freqWeek}</option>
                <option value="month">{t.freqMonth}</option>
              </select>
            </div>
            {frequency === "month" && (
              <div className="field">
                <label htmlFor="monthsInterval">{t.monthsIntervalLabel}</label>
                <select
                  id="monthsInterval"
                  value={monthsInterval}
                  onChange={(e) => setMonthsInterval(Number(e.target.value))}
                >
                  {MONTH_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n} {monthWord(n, t)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="nextDate">{t.nextDate}</label>
              <input
                id="nextDate"
                type="date"
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="add-btn">
            <Plus size={16} /> {t.add}
          </button>
        </form>
      </div>

      <div>
        <p className="list-heading">
          <span>{t.listHeading}</span>
          <span
            style={{ display: "flex", gap: "10px", alignItems: "baseline" }}
          >
            <span className="list-count">
              {payments.length} {t.entries}
            </span>
            <button
              className="add-btn"
              style={{ padding: "4px 10px", fontSize: "12.5px" }}
              onClick={exportExcel}
            >
              {t.exportExcel}
            </button>
          </span>
        </p>
        {payments.length === 0 ? (
          <div className="empty">
            <CircleDollarSign size={26} />
            <div>
              {t.emptyTitle}
              <br />
              {t.emptySubtitle}
            </div>
          </div>
        ) : (
          payments.map((p) => {
            const soon = daysUntil(p.nextDate) <= 3;
            return (
              <div className="row" key={p.id}>
                <div className="row-main">
                  <div className="row-name">{p.name}</div>
                  <div className={`row-meta ${soon ? "soon" : ""}`}>
                    {freqLabel(p, t)} · {nextDateLabel(p.nextDate, t)}
                  </div>
                </div>
                <div className="row-amount heading">{eur(p.amount, t)}</div>
                <div className="row-annual">
                  ≈ {eur(p.amount * freqPerYear(p), t)}
                  {t.perYear}
                </div>
                <button
                  className="row-del"
                  onClick={() => removePayment(p.id)}
                  aria-label={t.deleteAria(p.name)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
