'use client';

import React, { useState } from 'react';
import { Calculator, CheckCircle2, Send } from 'lucide-react';
import { submitPublicMembership, submitPublicContact } from '@/app/admin/actions';

export function SavingsCalculator() {
  const [dailyAmount, setDailyAmount] = useState(100);
  const [days, setDays] = useState(365);

  const totalDeposit = dailyAmount * days;
  const estimatedReturn = Math.round(totalDeposit * 1.095);

  return (
    <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#0d3429] text-amber-400">
          <Calculator size={20} />
        </span>
        <div>
          <h3 className="text-lg font-bold text-[#0d3429]">दैनिक बचत प्रतिफल क्याल्कुलेटर (Savings Calculator)</h3>
          <p className="text-xs text-slate-600">दैनिक बचत रकम राखी १ वर्षपछि प्राप्त हुने अनुमानित रकम हेर्नुहोस्</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">दैनिक बचत रकम (Daily Deposit Rs):</label>
          <input
            type="range"
            min="50"
            max="2000"
            step="50"
            value={dailyAmount}
            onChange={(e) => setDailyAmount(Number(e.target.value))}
            className="w-full accent-emerald-700 cursor-pointer"
          />
          <div className="mt-2 text-xl font-extrabold text-[#0d3429]">रु. {dailyAmount.toLocaleString()} / दिन</div>
        </div>

        <div className="rounded-xl bg-white p-5 border shadow-sm space-y-3">
          <div className="flex justify-between text-xs text-slate-600 border-b pb-2">
            <span>कुल जम्मा हुने रकम (३६५ दिन):</span>
            <strong className="text-slate-900">रु. {totalDeposit.toLocaleString()}</strong>
          </div>
          <div className="flex justify-between text-sm font-bold text-emerald-800 pt-1">
            <span>अनुमानित फिर्ता भुक्तानी रकम:</span>
            <strong className="text-xl text-[#0d3429]">रु. {estimatedReturn.toLocaleString()}</strong>
          </div>
          <p className="text-[10px] text-slate-500 italic">* ब्याजदर संस्थाको ३६५ दिने साधारण बचत योजना बमोजिम गणना गरिएको।</p>
        </div>
      </div>
    </div>
  );
}

export function LoanCalculator() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(10);
  const [months, setMonths] = useState(12);

  const monthlyRate = rate / 12 / 100;
  const emi = Math.round((amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)) || 0;
  const totalPayable = emi * months;

  return (
    <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/50 p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500 text-[#0d3429]">
          <Calculator size={20} />
        </span>
        <div>
          <h3 className="text-lg font-bold text-[#0d3429]">कर्जा किस्ता (EMI) क्याल्कुलेटर</h3>
          <p className="text-xs text-slate-600">कर्जा रकम र अवधि रोजेर मासिक किस्ता अनुमान गर्नुहोस्</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">कर्जा रकम (Loan Amount):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-xl border p-2.5 text-sm outline-none focus:border-emerald-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">वार्षिक ब्याजदर (%):</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full rounded-xl border p-2.5 text-sm outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">अवधि (महिना):</label>
              <input
                type="number"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full rounded-xl border p-2.5 text-sm outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 border shadow-sm space-y-3">
          <div className="flex justify-between text-xs text-slate-600 border-b pb-2">
            <span>अनुमानित मासिक किस्ता (Monthly EMI):</span>
            <strong className="text-lg font-extrabold text-[#0d3429]">रु. {emi.toLocaleString()}</strong>
          </div>
          <div className="flex justify-between text-xs text-slate-600 pt-1">
            <span>कुल फिर्ता रकम:</span>
            <strong className="text-slate-900">रु. {totalPayable.toLocaleString()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OnlineMembershipForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    const form = new FormData(e.currentTarget);
    try {
      await submitPublicMembership(form);
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'आवेदन बुझाउन समस्या भयो।');
    }
  }

  return (
    <div className="max-w-3xl mx-auto rounded-3xl border bg-white p-6 sm:p-10 shadow-lg">
      <div className="text-center mb-8">
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 mb-2">
          अनलाइन सेयरधनी सदस्यता आवेदन
        </span>
        <h2 className="text-2xl font-extrabold text-[#0d3429]">श्री कुशेश्वर बाबा कृषि सहकारी संस्था लि.</h2>
        <p className="text-xs text-slate-500 mt-1">घरै बसी सदस्यताका लागि फारम भर्नुहोस्। हाम्रा प्रतिनिधिले सम्पर्क गर्नुहुनेछ।</p>
      </div>

      {status === 'success' ? (
        <div className="rounded-2xl bg-emerald-50 p-8 text-center border border-emerald-200">
          <CheckCircle2 size={48} className="mx-auto text-emerald-600 mb-3" />
          <h3 className="text-xl font-bold text-[#0d3429]">तपाईंको सदस्यता आवेदन सफलतापुर्वक दर्ता भयो!</h3>
          <p className="mt-2 text-xs text-slate-600">
            हाम्रो संस्थाको कार्यालयबाट शीघ्र प्रमाणिकरण गरी तपाईंलाई सम्पर्क गरिनेछ। धन्यवाद!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {status === 'error' && (
            <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">{errorMsg}</div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">पूरा नाम (Full Name) *</label>
              <input required name="fullName" placeholder="उदा: राजकुमार चौधरी" className="w-full rounded-xl border p-2.5 text-xs outline-none focus:border-emerald-600" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">सम्पर्क फोन नम्बर (Phone) *</label>
              <input required name="phone" placeholder="उदा: 9812345678" className="w-full rounded-xl border p-2.5 text-xs outline-none focus:border-emerald-600" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">नागरिकता नम्बर (Citizenship No) *</label>
              <input required name="citizenshipNo" placeholder="उदा: ३३-०१-७५-१२३४५" className="w-full rounded-xl border p-2.5 text-xs outline-none focus:border-emerald-600" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">इमेल (Email - ऐच्छिक)</label>
              <input name="email" type="email" placeholder="example@gmail.com" className="w-full rounded-xl border p-2.5 text-xs outline-none focus:border-emerald-600" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ठेगाना (Address) *</label>
              <input required name="address" placeholder="करैयामाई गाउँपालिका–५, ढोढिया, बारा" className="w-full rounded-xl border p-2.5 text-xs outline-none focus:border-emerald-600" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">पेशा / व्यवसाय (Occupation)</label>
              <select name="occupation" className="w-full rounded-xl border bg-slate-50 p-2.5 text-xs outline-none focus:border-emerald-600">
                <option value="कृषि">कृषि (Farming)</option>
                <option value="व्यापार">व्यापार (Business)</option>
                <option value="वैदेशिक रोजगार">वैदेशिक रोजगार (Foreign Employment)</option>
                <option value="सेवा / नोकरी">सेवा / नोकरी (Service)</option>
                <option value="अन्य">अन्य (Other)</option>
              </select>
            </div>
          </div>

          <button
            disabled={status === 'submitting'}
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0d3429] py-3 text-sm font-bold text-amber-400 shadow hover:bg-emerald-900 transition"
          >
            <Send size={16} />
            {status === 'submitting' ? 'पेश हुँदैछ...' : 'सदस्यता फारम बुझाउनुहोस्'}
          </button>
        </form>
      )}
    </div>
  );
}

export function PublicContactForm() {
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await submitPublicContact(form);
    setSent(true);
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-[#0d3429] mb-4">सम्पर्क फारम (Send Inquiry)</h3>
      {sent ? (
        <div className="rounded-xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800">
          तपाईंको सन्देश सफलतापुर्वक प्राप्त भयो। धन्यवाद!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">नाम (Full Name) *</label>
            <input required name="name" className="w-full rounded-xl border p-2.5 text-xs outline-none focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">फोन (Phone) *</label>
            <input required name="phone" className="w-full rounded-xl border p-2.5 text-xs outline-none focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">विषय (Subject)</label>
            <input name="subject" placeholder="सोधपुछ वा सुझाव" className="w-full rounded-xl border p-2.5 text-xs outline-none focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">सन्देश (Message) *</label>
            <textarea required name="message" rows={4} className="w-full rounded-xl border p-2.5 text-xs outline-none focus:border-emerald-600" />
          </div>
          <button type="submit" className="w-full rounded-xl bg-[#0d3429] py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-900">
            सन्देश पठाउनुहोस्
          </button>
        </form>
      )}
    </div>
  );
}
