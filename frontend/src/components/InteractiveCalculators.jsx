import React, { useState } from 'react';
import { Calculator, Flame, Dumbbell, Scale } from 'lucide-react';

export const InteractiveCalculators = () => {
  const [activeTab, setActiveTab] = useState('macros');

  // Macro Calculator state
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState(28);
  const [weightKg, setWeightKg] = useState(75);
  const [heightCm, setHeightCm] = useState(178);
  const [activity, setActivity] = useState(1.55); // Moderate activity
  const [goal, setGoal] = useState('maintain');

  // 1RM Calculator state
  const [weightLifted, setWeightLifted] = useState(100);
  const [repsDone, setRepsDone] = useState(5);

  // --- Macro Calculations ---
  // Mifflin-St Jeor Formula
  const bmr =
    gender === 'male'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const tdee = Math.round(bmr * activity);

  let targetCalories = tdee;
  if (goal === 'cut') targetCalories = Math.round(tdee * 0.8);
  if (goal === 'bulk') targetCalories = Math.round(tdee * 1.15);

  // Protein (2g per kg), Fats (25% total cal), Carbs (remainder)
  const proteinGrams = Math.round(weightKg * 2.2);
  const proteinCals = proteinGrams * 4;

  const fatCals = Math.round(targetCalories * 0.25);
  const fatGrams = Math.round(fatCals / 9);

  const carbCals = targetCalories - proteinCals - fatCals;
  const carbGrams = Math.max(0, Math.round(carbCals / 4));

  // BMI Calculation
  const heightM = heightCm / 100;
  const bmi = (weightKg / (heightM * heightM)).toFixed(1);
  const bmiVal = parseFloat(bmi);

  let bmiCategory = 'Normal weight';
  if (bmiVal < 18.5) {
    bmiCategory = 'Underweight';
  } else if (bmiVal >= 25 && bmiVal < 29.9) {
    bmiCategory = 'Overweight';
  } else if (bmiVal >= 30) {
    bmiCategory = 'Obese';
  }

  // --- 1-Rep Max Calculations ---
  // Epley Formula: 1RM = Weight * (1 + Reps / 30)
  const oneRepMax = Math.round(weightLifted * (1 + repsDone / 30));

  return (
    <section id="calculators" className="py-24 bg-black text-white relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-block mb-3">
            <span className="text-[#B9FF00] text-xs font-bold tracking-[0.3em] uppercase border-l-2 border-[#B9FF00] pl-3 flex items-center gap-2">
              <Calculator className="w-4 h-4" /> Performance Science
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase mb-4">
            ATHLETIC <span className="text-[#B9FF00]">LABS.</span>
          </h2>
          <p className="text-white/50 text-base sm:text-lg font-light">
            Precision tools to quantify your daily caloric intake, macro ratios, and maximum 1RM strength limits.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="p-1 bg-zinc-950 border border-white/10 rounded-full flex items-center gap-2">
            <button
              onClick={() => setActiveTab('macros')}
              className={`px-6 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'macros'
                  ? 'bg-[#B9FF00] text-black shadow-lg shadow-[#B9FF00]/10'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4" /> Calorie & Macro Target
            </button>
            <button
              onClick={() => setActiveTab('oneRepMax')}
              className={`px-6 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'oneRepMax'
                  ? 'bg-[#B9FF00] text-black shadow-lg shadow-[#B9FF00]/10'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              <Dumbbell className="w-4 h-4" /> 1-Rep Max Strength
            </button>
          </div>
        </div>

        {/* Tab Content 1: Macro & Calorie Calculator */}
        {activeTab === 'macros' && (
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Input Controls */}
            <div className="lg:col-span-6 space-y-6">
              <h3 className="text-xl font-black italic uppercase text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#B9FF00]" /> Enter Your Metrics
              </h3>

              {/* Gender Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-3 rounded-xl border text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                    gender === 'male' ? 'bg-white/10 border-[#B9FF00] text-[#B9FF00]' : 'bg-black border-white/10 text-white/40'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-3 rounded-xl border text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                    gender === 'female' ? 'bg-white/10 border-[#B9FF00] text-[#B9FF00]' : 'bg-black border-white/10 text-white/40'
                  }`}
                >
                  Female
                </button>
              </div>

              {/* Sliders: Age, Weight, Height */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase text-white/70 mb-1">
                    <span>Age</span>
                    <span className="text-[#B9FF00]">{age} years</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={80}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full accent-[#B9FF00] bg-black rounded-lg cursor-pointer h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold uppercase text-white/70 mb-1">
                    <span>Body Weight</span>
                    <span className="text-[#B9FF00]">{weightKg} kg ({(weightKg * 2.20462).toFixed(0)} lbs)</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={150}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full accent-[#B9FF00] bg-black rounded-lg cursor-pointer h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold uppercase text-white/70 mb-1">
                    <span>Height</span>
                    <span className="text-[#B9FF00]">{heightCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min={130}
                    max={220}
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full accent-[#B9FF00] bg-black rounded-lg cursor-pointer h-2"
                  />
                </div>
              </div>

              {/* Activity Level Selector */}
              <div>
                <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">
                  Daily Activity Level
                </label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#B9FF00]"
                >
                  <option value={1.2}>Sedentary (Desk Job, Minimal Exercise)</option>
                  <option value={1.375}>Lightly Active (1-3 Workout Days/Wk)</option>
                  <option value={1.55}>Moderately Active (3-5 Intense Gym Days/Wk)</option>
                  <option value={1.725}>Very Active (6-7 Heavy Lifting Days/Wk)</option>
                </select>
              </div>

              {/* Primary Goal Selector */}
              <div>
                <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">
                  Primary Fitness Goal
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setGoal('cut')}
                    className={`py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      goal === 'cut' ? 'bg-[#B9FF00] text-black font-black' : 'bg-black border-white/10 text-white/40'
                    }`}
                  >
                    Fat Loss
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoal('maintain')}
                    className={`py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      goal === 'maintain' ? 'bg-[#B9FF00] text-black font-black' : 'bg-black border-white/10 text-white/40'
                    }`}
                  >
                    Maintain
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoal('bulk')}
                    className={`py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      goal === 'bulk' ? 'bg-[#B9FF00] text-black font-black' : 'bg-black border-white/10 text-white/40'
                    }`}
                  >
                    Muscle Gain
                  </button>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-6 bg-black border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Target Daily Intake</span>
                    <div className="text-3xl sm:text-4xl font-black italic text-[#B9FF00] mt-1">
                      {targetCalories.toLocaleString()} <span className="text-sm font-normal text-white/40">KCAL/DAY</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">BMI Index</span>
                    <div className="text-2xl font-black italic text-white mt-1">
                      {bmi} <span className="text-xs font-bold uppercase text-[#B9FF00]">({bmiCategory})</span>
                    </div>
                  </div>
                </div>

                {/* Macro Distribution Cards */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Macronutrient Targets</span>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 text-center">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">Protein</div>
                      <div className="text-xl font-black italic text-white mt-1">{proteinGrams}g</div>
                      <div className="text-[9px] text-white/40 font-medium">({proteinCals} kcal)</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 text-center">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">Carbs</div>
                      <div className="text-xl font-black italic text-white mt-1">{carbGrams}g</div>
                      <div className="text-[9px] text-white/40 font-medium">({carbCals} kcal)</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 text-center">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">Fats</div>
                      <div className="text-xl font-black italic text-white mt-1">{fatGrams}g</div>
                      <div className="text-[9px] text-white/40 font-medium">({fatCals} kcal)</div>
                    </div>
                  </div>
                </div>

                {/* Macro Bar Visualizer */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase font-bold text-white/40 tracking-wider">
                    <span>Protein 35%</span>
                    <span>Carbs 40%</span>
                    <span>Fats 25%</span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-zinc-900">
                    <div className="h-full bg-[#B9FF00]" style={{ width: '35%' }} />
                    <div className="h-full bg-white/40" style={{ width: '40%' }} />
                    <div className="h-full bg-white/20" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 text-xs text-white/50 leading-relaxed">
                💡 <span className="font-bold text-white">Coach Tip:</span> Combine this caloric target with our <span className="text-[#B9FF00] font-bold">Apex Athletic</span> class schedule for optimal body recomposition.
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: 1-Rep Max Calculator */}
        {activeTab === 'oneRepMax' && (
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Inputs */}
            <div className="lg:col-span-6 space-y-6">
              <h3 className="text-xl font-black italic uppercase text-white flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-[#B9FF00]" /> Enter Lift History
              </h3>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase text-white/70 mb-1">
                    <span>Weight Lifted (kg / lbs)</span>
                    <span className="text-[#B9FF00]">{weightLifted} kg</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={300}
                    step={2.5}
                    value={weightLifted}
                    onChange={(e) => setWeightLifted(Number(e.target.value))}
                    className="w-full accent-[#B9FF00] bg-black rounded-lg cursor-pointer h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold uppercase text-white/70 mb-1">
                    <span>Reps Performed</span>
                    <span className="text-[#B9FF00]">{repsDone} reps</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={repsDone}
                    onChange={(e) => setRepsDone(Number(e.target.value))}
                    className="w-full accent-[#B9FF00] bg-black rounded-lg cursor-pointer h-2"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black border border-white/10 text-xs text-white/50 leading-relaxed">
                Calculated using the validated Epley Formula <code className="text-[#B9FF00] font-mono">1RM = Weight × (1 + Reps/30)</code>.
              </div>
            </div>

            {/* Results Table */}
            <div className="lg:col-span-6 bg-black border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Estimated 1-Rep Max</span>
                <div className="text-4xl font-black italic text-[#B9FF00] mt-1">
                  {oneRepMax} <span className="text-base font-normal text-white/40">KG ({(oneRepMax * 2.20462).toFixed(0)} LBS)</span>
                </div>
              </div>

              {/* Percentage Load Zones Table */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Training Load Zones</span>
                <div className="space-y-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-white/10 flex justify-between items-center">
                    <span className="font-bold text-white/80">95% (Max Strength - 2 Reps)</span>
                    <span className="font-black italic text-[#B9FF00]">{Math.round(oneRepMax * 0.95)} KG</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-white/10 flex justify-between items-center">
                    <span className="font-bold text-white/80">85% (Heavy Power - 5 Reps)</span>
                    <span className="font-black italic text-[#B9FF00]">{Math.round(oneRepMax * 0.85)} KG</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-white/10 flex justify-between items-center">
                    <span className="font-bold text-white/80">75% (Hypertrophy - 10 Reps)</span>
                    <span className="font-black italic text-[#B9FF00]">{Math.round(oneRepMax * 0.75)} KG</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-white/10 flex justify-between items-center">
                    <span className="font-bold text-white/80">65% (Muscular Endurance - 15 Reps)</span>
                    <span className="font-black italic text-[#B9FF00]">{Math.round(oneRepMax * 0.65)} KG</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
