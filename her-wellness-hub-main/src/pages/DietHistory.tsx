import { useEffect, useState } from "react";

import DashboardLayout from "@/components/DashboardLayout";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  Clock,
  Flame,
  Sparkles
} from "lucide-react";

import { api } from "@/lib/api";

const DietHistory = () => {

  const [history, setHistory] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  // 🔥 LOAD HISTORY
  useEffect(() => {

    const loadHistory =
      async () => {

        try {

          const res =
            await api.getDietHistory();

          console.log(
            "DIET HISTORY:",
            res
          );

          setHistory(
            Array.isArray(res)
              ? res
              : []
          );

        } catch (err) {

          console.log(err);

        } finally {

          setLoading(false);

        }

      };

    loadHistory();

  }, []);

  return (

    <DashboardLayout>

      <div className="max-w-6xl mx-auto p-6 space-y-6">

        {/* 🔥 TITLE */}
        <div>

          <h1 className="text-4xl font-bold text-pink-600">

            Meal History 🍱

          </h1>

          <p className="text-gray-500 mt-1">

            Previously generated AI meal plans

          </p>

        </div>

        {/* 🔥 LOADING */}
        {loading && (

          <div className="text-center py-10 text-gray-500">

            Loading meal history...

          </div>

        )}

        {/* 🔥 EMPTY */}
        {!loading &&
          history.length === 0 && (

            <Card>

              <CardContent className="py-10 text-center text-gray-500">

                No meal history found 😢

              </CardContent>

            </Card>

          )}

        {/* 🔥 HISTORY */}
        <div className="grid lg:grid-cols-2 gap-6">

          {history.map((item, index) => (

            <Card
              key={index}
              className="border-pink-100 shadow-lg"
            >

              <CardHeader>

                <div className="flex items-center justify-between">

                  <CardTitle className="text-pink-600">

                    AI Meal Plan 🍽️

                  </CardTitle>

                  <Badge
                    className="bg-pink-500"
                  >

                    #{index + 1}

                  </Badge>

                </div>

              </CardHeader>

              <CardContent className="space-y-5">

                {/* 🔥 INGREDIENTS */}
                <div>

                  <h2 className="font-semibold mb-2">

                    Ingredients Used

                  </h2>

                  <div className="flex flex-wrap gap-2">

                    {item.ingredients?.map(
                      (
                        ing: string,
                        i: number
                      ) => (

                        <Badge
                          key={i}
                          variant="secondary"
                          className="rounded-full"
                        >

                          {ing}

                        </Badge>

                      )
                    )}

                  </div>

                </div>

                {/* 🔥 BENEFITS */}
                {item.plan?.benefits && (

                  <div className="bg-pink-50 rounded-2xl p-4">

                    <div className="flex items-center gap-2 mb-2">

                      <Sparkles className="w-4 h-4 text-pink-500" />

                      <h2 className="font-semibold text-pink-600">

                        AI Benefits

                      </h2>

                    </div>

                    <ul className="space-y-2 text-sm">

                      {item.plan.benefits.map(
                        (
                          benefit: string,
                          i: number
                        ) => (

                          <li
                            key={i}
                            className="flex gap-2"
                          >

                            <span>🌸</span>

                            <span>
                              {benefit}
                            </span>

                          </li>

                        )
                      )}

                    </ul>

                  </div>

                )}

                {/* 🔥 MEALS */}
                <div className="space-y-4">

                  {[
                    "breakfast",
                    "lunch",
                    "dinner",
                    "snacks"
                  ].map((mealType) => {

                    const meal =
                      item.plan?.[
                        mealType
                      ];

                    if (!meal)
                      return null;

                    return (

                      <div
                        key={mealType}
                        className="border rounded-2xl p-4 bg-white"
                      >

                        {/* 🔥 HEADER */}
                        <div className="flex items-center justify-between mb-2">

                          <h3 className="font-bold capitalize text-pink-600">

                            {mealType}

                          </h3>

                          <div className="flex items-center gap-1 text-sm text-orange-500">

                            <Flame className="w-4 h-4" />

                            {meal.calories || 0} kcal

                          </div>

                        </div>

                        {/* 🔥 MEAL */}
                        <p className="font-semibold mb-2">

                          🍽️ {meal.meal}

                        </p>

                        {/* 🔥 INGREDIENTS */}
                        <div className="mb-3">

                          <p className="font-medium text-sm mb-1">

                            Ingredients

                          </p>

                          <div className="flex flex-wrap gap-2">

                            {meal.ingredients?.map(
                              (
                                ing: string,
                                i: number
                              ) => (

                                <Badge
                                  key={i}
                                  variant="outline"
                                >

                                  {ing}

                                </Badge>

                              )
                            )}

                          </div>

                        </div>

                        {/* 🔥 BENEFIT */}
                        {meal.benefit && (

                          <div className="bg-pink-50 rounded-xl p-3 text-sm">

                            🌸 {meal.benefit}

                          </div>

                        )}

                        {/* 🔥 PREPARATION */}
                        {meal.preparation && (

                          <div className="mt-3 text-sm text-gray-600">

                            <span className="font-semibold">

                              Preparation:

                            </span>

                            <p className="mt-1">

                              {meal.preparation}

                            </p>

                          </div>

                        )}

                      </div>

                    );

                  })}

                </div>

                {/* 🔥 TIME */}
                <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">

                  <Clock className="w-4 h-4" />

                  {new Date(
                    item.createdAt
                  ).toLocaleString()}

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      </div>

    </DashboardLayout>

  );

};

export default DietHistory;