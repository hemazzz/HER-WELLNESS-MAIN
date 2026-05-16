import { useEffect, useState } from "react";

import DashboardLayout from "@/components/DashboardLayout";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Slider } from "@/components/ui/slider";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { api } from "@/lib/api";

const Dashboard = () => {

  const [data, setData] =
    useState<any[]>([]);

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({

      sleepHours: 7,
      stepsWalked: 5000,
      waterIntake: 6,
      stressLevel: 5,
      dietQuality: 6,

    });

  // 🔥 LOAD DATA
  const loadData = async () => {

    try {

      const res =
        await api.getHealthData();

      console.log(
        "HEALTH DATA:",
        res
      );

      setData(
        Array.isArray(res)
          ? res
          : []
      );

    } catch (err) {

      console.log(
        "Error loading data:",
        err
      );

    }

  };

  useEffect(() => {

    loadData();

  }, []);

  // 🔥 HEALTH SCORE
  const calculateScore =
    (d: any) => {

      if (!d) return 0;

      const sleep =
        d.sleepHours || 0;

      const water =
        d.waterIntake || 0;

      const steps =
        d.stepsWalked || 0;

      const diet =
        d.dietQuality || 0;

      const stress =
        d.stressLevel || 0;

      let score =

        sleep * 10 +

        water * 5 +

        (steps / 1000) * 5 +

        diet * 10 -

        stress * 5;

      return Math.max(
        0,
        Math.min(
          100,
          Math.round(score)
        )
      );

    };

  // 🔥 SAVE
  const handleAdd = async () => {

    try {

      setLoading(true);

      const response =
        await api.addHealthData({

          ...form,

          date:
            new Date(),

        });

      console.log(
        "SAVE RESPONSE:",
        response
      );

      await loadData();

      setOpen(false);

    } catch (err) {

      console.log(
        "Save failed:",
        err
      );

      alert(
        "Failed to save health data ❌"
      );

    } finally {

      setLoading(false);

    }

  };

  const latest =
    data.length > 0
      ? data[data.length - 1]
      : null;

  // 🔥 SCORE
  const score =
    latest
      ? latest.healthScore ||
        calculateScore(latest)
      : 0;

  // 🔥 AI SUMMARY
  const generateSummary =
    () => {

      const messages = [];

      if (
        latest?.protein >= 60
      ) {

        messages.push(
          "💪 Protein intake supports your hormonal and thyroid health."
        );

      }

      if (
        latest?.waterIntake < 5
      ) {

        messages.push(
          "💧 Water intake is slightly low today."
        );

      }

      if (
        latest?.stepsWalked < 5000
      ) {

        messages.push(
          "🚶 Try walking more for better wellness and metabolism."
        );

      }

      if (
        latest?.stressLevel > 7
      ) {

        messages.push(
          "🧘 High stress detected. Relaxation may help."
        );

      }

      if (
        latest?.sleepHours < 6
      ) {

        messages.push(
          "😴 Sleep duration is low. Proper sleep improves recovery."
        );

      }

      if (
        messages.length === 0
      ) {

        messages.push(
          "🌸 Your wellness looks balanced today."
        );

      }

      return messages;

    };

  const aiSummary =
    generateSummary();

  // 🔥 HEALTH STATUS
  const getHealthStatus =
    () => {

      if (score >= 80) {

        return {

          text:
            "Excellent Health 🌸",

          color:
            "text-green-600",

          bg:
            "bg-green-100",

        };

      }

      if (score >= 60) {

        return {

          text:
            "Good Health 💪",

          color:
            "text-blue-600",

          bg:
            "bg-blue-100",

        };

      }

      if (score >= 40) {

        return {

          text:
            "Average Health ⚠️",

          color:
            "text-yellow-600",

          bg:
            "bg-yellow-100",

        };

      }

      return {

        text:
          "Health Needs Attention ❤️",

        color:
          "text-red-600",

        bg:
          "bg-red-100",

      };

    };

  const healthStatus =
    getHealthStatus();

  return (

    <DashboardLayout>

      <div className="space-y-6">

        {/* 🔥 HEADER */}
        <div className="flex justify-between items-center mt-2">

          <h1 className="text-3xl font-bold">

            AI Wellness Dashboard

          </h1>

          {/* 🔥 DIALOG */}
          <Dialog
            open={open}
            onOpenChange={setOpen}
          >

            <DialogTrigger asChild>

              <Button>

                Add Today

              </Button>

            </DialogTrigger>

            <DialogContent>

              <DialogHeader>

                <DialogTitle>

                  Log Health Data

                </DialogTitle>

              </DialogHeader>

              <div className="space-y-4">

                {/* 😴 SLEEP */}
                <p>
                  Sleep:
                  {" "}
                  {form.sleepHours} hrs
                </p>

                <Slider
                  value={[
                    form.sleepHours
                  ]}
                  onValueChange={(v) =>
                    setForm({

                      ...form,

                      sleepHours:
                        v[0],

                    })
                  }
                  max={12}
                />

                {/* 🚶 STEPS */}
                <p>
                  Steps:
                  {" "}
                  {form.stepsWalked}
                </p>

                <Slider
                  value={[
                    form.stepsWalked
                  ]}
                  onValueChange={(v) =>
                    setForm({

                      ...form,

                      stepsWalked:
                        v[0],

                    })
                  }
                  max={20000}
                />

                {/* 💧 WATER */}
                <p>
                  Water:
                  {" "}
                  {form.waterIntake}
                </p>

                <Slider
                  value={[
                    form.waterIntake
                  ]}
                  onValueChange={(v) =>
                    setForm({

                      ...form,

                      waterIntake:
                        v[0],

                    })
                  }
                  max={15}
                />

                {/* 🧘 STRESS */}
                <p>
                  Stress:
                  {" "}
                  {form.stressLevel}
                </p>

                <Slider
                  value={[
                    form.stressLevel
                  ]}
                  onValueChange={(v) =>
                    setForm({

                      ...form,

                      stressLevel:
                        v[0],

                    })
                  }
                  max={10}
                />

                {/* 🥗 DIET */}
                <p>
                  Diet:
                  {" "}
                  {form.dietQuality}
                </p>

                <Slider
                  value={[
                    form.dietQuality
                  ]}
                  onValueChange={(v) =>
                    setForm({

                      ...form,

                      dietQuality:
                        v[0],

                    })
                  }
                  max={10}
                />

                {/* 🔥 SAVE */}
                <Button
                  onClick={handleAdd}
                  className="w-full bg-pink-500 hover:bg-pink-600"
                  disabled={loading}
                >

                  {loading
                    ? "Saving..."
                    : "Save"}

                </Button>

              </div>

            </DialogContent>

          </Dialog>

        </div>

        {/* 🔥 STATS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

          <Card>
            <CardContent className="p-4">

              <p className="text-sm text-gray-500">
                Health Score
              </p>

              <h2 className="text-2xl font-bold text-pink-600">
                {score}
              </h2>

            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">

              <p className="text-sm text-gray-500">
                Calories
              </p>

              <h2 className="text-2xl font-bold text-orange-500">
                {latest?.calories || 0}
              </h2>

            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">

              <p className="text-sm text-gray-500">
                Protein
              </p>

              <h2 className="text-2xl font-bold text-blue-500">
                {latest?.protein || 0} g
              </h2>

            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">

              <p className="text-sm text-gray-500">
                Water
              </p>

              <h2 className="text-2xl font-bold text-cyan-500">
                {latest?.waterIntake || 0}
              </h2>

            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">

              <p className="text-sm text-gray-500">
                Stress
              </p>

              <h2 className="text-2xl font-bold text-red-500">
                {latest?.stressLevel || 0}
              </h2>

            </CardContent>
          </Card>

        </div>

        {/* 🔥 AI WELLNESS SUMMARY */}
        <Card className="border-pink-200 shadow-lg">

          <CardHeader>

            <CardTitle>

              AI Wellness Summary 🌸

            </CardTitle>

          </CardHeader>

          <CardContent className="space-y-4">

            {/* STATUS */}
            <div
              className={`${healthStatus.bg} p-4 rounded-xl`}
            >

              <h2
                className={`text-xl font-bold ${healthStatus.color}`}
              >

                {healthStatus.text}

              </h2>

            </div>

            {/* AI SUMMARY */}
            <div className="space-y-3">

              {aiSummary.map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={index}
                    className="bg-pink-50 p-4 rounded-xl text-sm"
                  >

                    {item}

                  </div>

                )
              )}

            </div>

          </CardContent>

        </Card>

      </div>

    </DashboardLayout>

  );

};

export default Dashboard;