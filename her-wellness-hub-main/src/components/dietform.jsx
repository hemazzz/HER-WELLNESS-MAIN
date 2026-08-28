import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DietForm = () => {
  const [customFood, setCustomFood] = useState("");
  const [customFoods, setCustomFoods] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddFood = () => {
    if (!customFood.trim()) return;

    if (customFoods.includes(customFood.trim())) {
      setCustomFood("");
      return;
    }

    setCustomFoods([...customFoods, customFood.trim()]);
    setCustomFood("");
  };

  const handleRemoveFood = (food) => {
    setCustomFoods(customFoods.filter((f) => f !== food));
  };

  const generateDietPlan = async () => {
    if (customFoods.length === 0) return;

    setLoading(true);

    try {
      const res = await fetch("http://16.176.147.35/api/diet-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: customFoods,
          mode: "available-food-only",
        }),
      });

      const data = await res.json();
      setPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* INPUT */}
      <Card>
        <CardContent className="p-4 space-y-3">

          <div className="flex gap-2">
            <input
              value={customFood}
              onChange={(e) => setCustomFood(e.target.value)}
              placeholder="Enter groceries..."
              className="flex-1 border px-3 py-2 rounded-lg"
            />
            <button
              onClick={handleAddFood}
              className="bg-pink-500 text-white px-4 rounded-lg"
            >
              Add
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {customFoods.map((f, i) => (
              <Badge key={i} onClick={() => handleRemoveFood(f)}>
                {f} ❌
              </Badge>
            ))}
          </div>

        </CardContent>
      </Card>

      {/* BUTTON */}
      <button
        onClick={generateDietPlan}
        className="bg-pink-600 text-white w-full py-3 rounded-lg"
      >
        {loading ? "Generating..." : "Generate Meals"}
      </button>

      {/* RESULT */}
      {plan && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {["breakfast", "lunch", "dinner", "snacks"].map((meal) => (
            <Card key={meal}>
              <CardContent className="p-4">
                <h3 className="font-bold capitalize">{meal}</h3>
                {plan[meal]?.map((item, i) => (
                  <p key={i}>• {item}</p>
                ))}
              </CardContent>
            </Card>
          ))}

        </div>
      )}

    </div>
  );
};

export default DietForm;
