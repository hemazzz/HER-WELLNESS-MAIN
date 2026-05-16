import { useState } from "react";

import DashboardLayout from "@/components/DashboardLayout";

import {
  Card,
  CardContent
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { api } from "@/lib/api";

const DietPlan = () => {

  const [input, setInput] =
    useState("");

  const [groceries, setGroceries] =
    useState<string[]>([]);

  const [avoid, setAvoid] =
    useState("");

  const [meals, setMeals] =
    useState<any>({});

  const [loading, setLoading] =
    useState(false);

  // ➕ ADD ITEM
  const addItem = () => {

    if (!input.trim()) return;

    setGroceries([
      ...groceries,
      input.trim()
    ]);

    setInput("");

  };

  // ❌ REMOVE ITEM
  const removeItem = (
    item: string
  ) => {

    setGroceries(
      groceries.filter(
        (g) => g !== item
      )
    );

  };

  // 🔥 TOTAL CALORIES
  const calculateTotalCalories =
    (dietPlan: any) => {

      const mealTypes = [
        "breakfast",
        "lunch",
        "dinner",
        "snacks"
      ];

      return mealTypes.reduce(
        (total, type) => {

          const value =
            Number(
              dietPlan?.[type]
                ?.calories
            ) || 0;

          return total + value;

        },
        0
      );

    };

  // 🔥 TOTAL PROTEIN
  const calculateTotalProtein =
    (dietPlan: any) => {

      const mealTypes = [
        "breakfast",
        "lunch",
        "dinner",
        "snacks"
      ];

      return mealTypes.reduce(
        (total, type) => {

          const value =
            Number(
              dietPlan?.[type]
                ?.protein
            ) || 0;

          return total + value;

        },
        0
      );

    };

  // 🍽️ GENERATE AI DIET
  const handleGenerate =
    async () => {

      console.log(
        "🔥 GENERATE CLICKED"
      );

      if (
        groceries.length === 0
      ) {

        alert(
          "Add groceries first 😅"
        );

        return;

      }

      setLoading(true);

      try {

        const res =
          await api.getDietPlan({

            ingredients:
              groceries,

            avoid: avoid
              ? avoid
                  .split(",")
                  .map((a) =>
                    a.trim()
                  )
              : []

          });

        console.log(
          "🔥 RESPONSE:",
          res
        );

        const generatedMeals =
          res?.diet_plan || {};

        // 🔥 SET MEALS
        setMeals(
          generatedMeals
        );

        // 🔥 TOTAL VALUES
        const totalCalories =
          calculateTotalCalories(
            generatedMeals
          );

        const totalProtein =
          calculateTotalProtein(
            generatedMeals
          );

        console.log(
          "TOTAL KCAL:",
          totalCalories
        );

        console.log(
          "TOTAL PROTEIN:",
          totalProtein
        );

        // 🔥 AUTO SAVE TO DASHBOARD
        await api.addHealthData({

          sleepHours: 7,

          stepsWalked: 5000,

          waterIntake: 6,

          stressLevel: 4,

          dietQuality: 8,

          calories:
            totalCalories,

          protein:
            totalProtein,

          date:
            new Date()

        });

        console.log(
          "🔥 Health data auto saved"
        );

      } catch (err) {

        console.log(
          "❌ ERROR:",
          err
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <DashboardLayout>

      <div className="p-6 max-w-6xl mx-auto space-y-6">

        {/* 🔥 TITLE */}
        <div className="text-center">

          <h1 className="text-4xl font-bold text-pink-600">

            AI Diet Generator 🍽️

          </h1>

          <p className="text-gray-500 mt-2">

            Personalized AI meal plans based on your ingredients and health condition

          </p>

        </div>

        {/* 🔥 INPUT CARD */}
        <Card className="shadow-xl border-pink-100">

          <CardContent className="space-y-4 p-6">

            {/* INPUT */}
            <div className="flex gap-2">

              <Input
                placeholder="Enter ingredients (milk, oats, rice...)"
                value={input}
                onChange={(e) =>
                  setInput(
                    e.target.value
                  )
                }
                className="h-12"
              />

              <Button
                onClick={addItem}
                className="bg-pink-500 hover:bg-pink-600"
              >

                Add

              </Button>

            </div>

            {/* AVOID */}
            <Input
              placeholder="Avoid foods (optional)"
              value={avoid}
              onChange={(e) =>
                setAvoid(
                  e.target.value
                )
              }
              className="h-12"
            />

            {/* TAGS */}
            <div className="flex flex-wrap gap-2">

              {groceries.map(
                (item, i) => (

                  <span
                    key={i}
                    onClick={() =>
                      removeItem(item)
                    }
                    className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-pink-600 transition"
                  >

                    {item} ✕

                  </span>

                )
              )}

            </div>

            {/* BUTTON */}
            <Button
              onClick={
                handleGenerate
              }
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 h-12 text-lg"
            >

              {loading
                ? "Generating AI Meals..."
                : "Generate AI Meal Plan"}

            </Button>

          </CardContent>

        </Card>

        {/* 🔥 RESULTS */}
        <div className="grid md:grid-cols-2 gap-5">

          {[
            "breakfast",
            "lunch",
            "dinner",
            "snacks"
          ].map((type) => {

            const mealData =
              meals?.[type];

            return (

              <Card
                key={type}
                className="shadow-lg border-pink-100"
              >

                <CardContent className="p-5 space-y-4">

                  {/* 🔥 TITLE */}
                  <h2 className="font-bold capitalize text-2xl text-pink-600">

                    {type}

                  </h2>

                  {mealData ? (

                    <div className="space-y-4">

                      {/* 🍽️ MEAL */}
                      <div className="bg-pink-100 p-4 rounded-2xl">

                        <p className="font-bold text-lg text-pink-700">

                          🍽️ {mealData.meal || mealData.dish}

                        </p>

                      </div>

                      {/* 🔥 CALORIES + 💪 PROTEIN */}
                      <div className="flex gap-3 flex-wrap">

                        <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">

                          🔥 {mealData.calories} kcal

                        </div>

                        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">

                          💪 {mealData.protein} g protein

                        </div>

                      </div>

                      {/* 🥗 INGREDIENTS */}
                      <div className="bg-pink-50 p-4 rounded-2xl">

                        <p className="font-semibold mb-2 text-pink-700">

                          Ingredients

                        </p>

                        <ul className="list-disc pl-5 text-sm space-y-1">

                          {mealData
                            ?.ingredients
                            ?.map(
                              (
                                ing: string,
                                idx: number
                              ) => (

                                <li key={idx}>
                                  {ing}
                                </li>

                              )
                            )}

                        </ul>

                      </div>

                      {/* 👩‍🍳 PREPARATION */}
                      <div className="bg-pink-50 p-4 rounded-2xl">

                        <p className="font-semibold mb-2 text-pink-700">

                          Preparation

                        </p>

                        <p className="text-sm leading-6 text-gray-700">

                          {mealData.preparation}

                        </p>

                      </div>

                      {/* 🌸 HEALTH BENEFIT */}
                      <div className="bg-green-50 p-4 rounded-2xl border border-green-100">

                        <p className="font-semibold mb-2 text-green-700">

                          Health Benefit 🌿

                        </p>

                        <p className="text-sm leading-6 text-gray-700">

                          {
                            Array.isArray(mealData?.benefits)

                              ? mealData.benefits.join(", ")

                              : mealData?.healthBenefit
                          }

                        </p>

                      </div>

                    </div>

                  ) : (

                    <div className="text-center py-10 text-gray-400">

                      No meal generated

                    </div>

                  )}

                </CardContent>

              </Card>

            );

          })}

        </div>

      </div>

    </DashboardLayout>

  );

};

export default DietPlan;