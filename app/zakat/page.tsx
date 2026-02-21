'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calculator, ArrowLeft, Coins, CreditCard, Landmark, Banknote } from 'lucide-react'
import { SectionMenu } from '@/components/SectionMenu'
import { motion } from 'framer-motion'

export default function ZakatPage() {
  const [cash, setCash] = useState<number | ''>('')
  const [gold, setGold] = useState<number | ''>('')
  const [silver, setSilver] = useState<number | ''>('')
  const [investments, setInvestments] = useState<number | ''>('')
  const [debts, setDebts] = useState<number | ''>('')

  const handleInput = (val: string) => {
    const num = parseFloat(val)
    return isNaN(num) ? '' : num
  }

  const totalAssets = (Number(cash) || 0) + (Number(gold) || 0) + (Number(silver) || 0) + (Number(investments) || 0)
  const totalDebts = Number(debts) || 0
  const netWealth = totalAssets - totalDebts
  const zakatPayable = netWealth > 0 ? netWealth * 0.025 : 0

  return (
    <main dir="ltr" className="min-h-screen bg-gradient-to-br from-white to-primary-light/30 dark:from-gray-900 dark:to-gray-800">
      <SectionMenu />
      <div className="pt-20 px-4 pb-20">
        <div className="max-w-4xl mx-auto pt-10">
          <div className="text-center mb-10">
            <Calculator className="w-16 h-16 text-gold mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-amiri text-gold mb-2">زکوٰۃ</h1>
            <h2 className="text-2xl md:text-3xl font-nastaliq font-bold text-primary rtl">زکوٰۃ کیلکولیٹر</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
              Calculate your obligatory Zakat easily. Enter your wealth in your local currency. Zakat is 2.5% of your net wealth (Total Assets - Liabilities), provided it exceeds the Nisab threshold.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-primary/10">
                <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Landmark className="w-6 h-6" />
                  Your Assets
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cash (at home & bank)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Banknote className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={cash}
                        onChange={(e) => setCash(handleInput(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value of Gold & Silver</label>
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Coins className="h-5 w-5 text-gold" />
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={gold}
                          onChange={(e) => setGold(handleInput(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="Gold Value"
                        />
                      </div>
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Coins className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={silver}
                          onChange={(e) => setSilver(handleInput(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="Silver Value"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Investments & Business Assets</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Landmark className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={investments}
                        onChange={(e) => setInvestments(handleInput(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-primary/10">
                <h3 className="text-xl font-bold text-red-500 mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  Your Liabilities
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Debts & Immediate Expenses</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 font-bold">-</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={debts}
                      onChange={(e) => setDebts(handleInput(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="md:col-span-1">
              <motion.div
                className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-6 shadow-2xl text-white sticky top-24"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h3 className="text-xl font-bold mb-6 font-nastaliq rtl text-right">نتائج</h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center border-b border-white/20 pb-2">
                    <span className="text-white/80">Total Assets</span>
                    <span className="font-mono font-bold">{totalAssets.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-2">
                    <span className="text-white/80">Liabilities</span>
                    <span className="font-mono font-bold text-red-300">-{totalDebts.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-white font-bold">Net Wealth</span>
                    <span className="font-mono font-bold text-xl">{netWealth > 0 ? netWealth.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'}</span>
                  </div>
                </div>

                <div className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/20">
                  <p className="text-sm text-gold font-bold mb-2 uppercase tracking-wider">Total Zakat Payable</p>
                  <p className="text-4xl font-mono font-bold text-white mb-2 tracking-tighter">
                    {zakatPayable.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-white/60">
                    * If net wealth is above Nisab
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
