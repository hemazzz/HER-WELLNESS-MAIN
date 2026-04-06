import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils } from "lucide-react";

const DietPlanPage = () => {
  const [customFood, setCustomFood] = useState("");
  const [customFoods, setCustomFoods] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [avoid, setAvoid] = useState("");

  // ✅ Add Ingredient
  const handleAddFood = () => {
    const food = customFood.trim().toLowerCase();

    if (!food) return;

    if (customFoods.includes(food)) {
      setCustomFood("");
      return;
    }

    setCustomFoods([...customFoods, food]);
    setCustomFood("");
  };

  // ❌ Remove Ingredient
  const handleRemoveFood = (food) => {
    setCustomFoods(customFoods.filter((f) => f !== food));
  };

  // 🤖 Generate Diet Plan
  const generateDietPlan = async () => {
    if (customFoods.length === 0) {
      setError("Please add at least one ingredient");
      return;
    }

    setLoading(true);
    setError("");
    setPlan(null);

    try {
      const response = await fetch("http://localhost:5000/api/diet/diet-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ingredients: customFoods,
          avoid: avoid.split(",").map(i => i.trim()).filter(Boolean)
        })
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();
      console.log("✅ AI Response:", data);

      setPlan(data);

    } catch (err) {
      console.error(err);
      setError("Failed to generate diet plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* 🔥 TITLE */}
        <h1 className="text-3xl font-bold flex gap-2 items-center">
          <Utensils /> AI Diet Planner
        </h1>

        {/* 📦 INPUT CARD */}
        <Card>
          <CardContent className="p-4 space-y-3">

            {/* INPUT FIELD */}
            <div className="flex gap-2">
              <input
                value={customFood}
                onChange={(e) => setCustomFood(e.target.value)}
                placeholder="Enter available groceries..."
                className="flex-1 border px-3 py-2 rounded-lg focus:outline-pink-400"
              />
              <button
                onClick={handleAddFood}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 rounded-lg"
              >
                Add
              </button>
            </div>

            {/* ⚡ AVOID INPUT */}
            <input
              value={avoid}
              onChange={(e) => setAvoid(e.target.value)}
              placeholder="Avoid ingredients (e.g. milk, nuts)"
              className="border px-3 py-2 rounded-lg w-full"
            />

            {/* 🏷️ INGREDIENT TAGS */}
            <div className="flex gap-2 flex-wrap">
              {customFoods.map((f, i) => (
                <Badge
                  key={i}
                  className="cursor-pointer"
                  onClick={() => handleRemoveFood(f)}
                >
                  {f} ❌
                </Badge>
              ))}
            </div>

            {/* ❌ ERROR */}
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

          </CardContent>
        </Card>

        {/* 🚀 GENERATE BUTTON */}
        <button
          onClick={generateDietPlan}
          disabled={loading}
          className="bg-pink-600 hover:bg-pink-700 text-white w-full py-3 rounded-lg"
        >
          {loading ? "Generating..." : "Generate Meals"}
        </button>

        {/* 🤖 LOADING TEXT */}
        {loading && (
          <p className="text-center">Generating smart diet... 🤖</p>
        )}

        {/* 🍽️ RESULT */}
        {plan && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {["breakfast", "lunch", "dinner", "snacks"].map((meal) => (
              <Card key={meal}>
                <CardContent className="p-4">
                  <h3 className="font-bold capitalize mb-2">
                    {meal}
                  </h3>

                  {Array.isArray(plan[meal]) && plan[meal].length > 0 ? (
                    plan[meal].map((item, i) => (
                      <div key={i} className="mb-2">
                        <p>🍽️ {item.name}</p>
                        <p className="text-sm text-gray-500">
                          🔥 {item.calories} kcal | 🥩 {item.protein}g | 🍚 {item.carbs}g
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No items</p>
                  )}

                </CardContent>
              </Card>
            ))}

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default DietPlanPage;